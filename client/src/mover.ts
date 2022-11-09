import { MoveType, PieceType } from './types';
import { Piece } from './piece';
import { Army } from './army';
import { Move } from './move';
import { Position } from './position';

export class Mover {
	//region Helper Methods

	getForwardDirection(armyIndex: number): number {
		return armyIndex === 0 ? -1 : 1;
	}
	getX(i: number): number {
		return i % 8;
	}
	getY(i: number): number {
		return Math.trunc(i / 8);
	}
	getXAndY(i: number): [number, number] {
		return [i % 8, Math.trunc(i / 8)];
	}
	getFile(i: number): string {
		return String.fromCharCode(97 + (i % 8));
	}
	getRank(i: number): number {
		return 8 - Math.trunc(i / 8);
	}
	getFileAndRank(i: number): [string, number] {
		return [String.fromCharCode(97 + (i % 8)), 8 - Math.trunc(i / 8)];
	}
	isXOk(x: number): boolean {
		return x >= 0 && x <= 7;
	}
	isYOk(y: number): boolean {
		return y >= 0 && y <= 7;
	}
	getIndex(x: number, y: number): number {
		return y * 8 + x;
	}
	belongsToArmy(pd: string[], i: number, armyIndex: number): boolean {
		return !!pd[i] && (pd[i] === pd[i].toUpperCase() ? 0 : 1) === armyIndex;
	}
	hasPiece(p: Position, i: number): boolean {
		return !!p.pieceData[i];
	}
	isEmpty(p: Position, i: number): boolean {
		return !p.pieceData[i];
	}
	isPieceOfType(p: Position, i: number, pieceType: PieceType): boolean {
		return p.pieceData[i].toLowerCase() === pieceType;
	}
	getCasedPieceType(p: Position, pieceType: PieceType) {
		return p.armyIndex === 0 ? pieceType.toUpperCase() : pieceType.toLowerCase();
	}
	getPromotionMoveType(pieceType: PieceType): MoveType {
		if (pieceType === PieceType.QUEEN) return MoveType.PROMOTION_TO_Q;
		if (pieceType === PieceType.ROOK) return MoveType.PROMOTION_TO_R;
		if (pieceType === PieceType.BISHOP) return MoveType.PROMOTION_TO_B;
		if (pieceType === PieceType.KNIGHT) return MoveType.PROMOTION_TO_N;
		return MoveType.NA;
	}

	//endregion

	isSquareAttacked(p: Position, i: number, attackerArmyIndex: number) {
		const myArmyIndex = Army.flipArmyIndex(attackerArmyIndex);
		const fw = this.getForwardDirection(myArmyIndex);
		const pd = p.pieceData;
		let aX, aY, aI;

		const [x, y] = this.getXAndY(i);
		//pawns
		for (const d of [-1, 1]) {
			aX = x + d;
			aY = y + fw;
			aI = this.getIndex(aX, aY);
			if (this.isXOk(aX) && this.isYOk(aY) && this.isPieceOfType(p, aI, PieceType.PAWN) && this.belongsToArmy(pd, aI, attackerArmyIndex)) {
				return true;
			}
		}
		//pieces
		for (const pieceType of [PieceType.KING, PieceType.QUEEN, PieceType.ROOK, PieceType.BISHOP, PieceType.KNIGHT]) {
			const directions: number[][] = Piece.getDirections(pieceType);
			for (let d = 0; d < directions.length; d++) {
				let step = 0;
				let stop = false;
				while (!stop) {
					step++;
					aX = x + directions[d][0] * step;
					aY = y + directions[d][1] * step;
					aI = this.getIndex(aX, aY);
					if (!this.isXOk(aX) || !this.isYOk(aY) || this.belongsToArmy(pd, aI, myArmyIndex)) {
						stop = true;
					} else if (this.belongsToArmy(pd, aI, attackerArmyIndex) && this.isPieceOfType(p, aI, pieceType)) {
						return true;
					}
					if (!stop && !Piece.isLongRange(pieceType)) {
						stop = true;
					}
				}
			}
		}

		return false;
	}

	areSquareAttacked(p: Position, squareIndexes: number[], attackerArmyIndex: number) {
		return squareIndexes.every(i => this.isSquareAttacked(p, i, attackerArmyIndex));
	}

	getMovesForPawn(p: Position, i: number): Move[] {
		const moves: Move[] = [];
		const [x, y] = this.getXAndY(i);
		const fw = this.getForwardDirection(p.armyIndex);
		let np;

		//pawn single step
		const to = this.getIndex(x, y + fw);
		if (this.isYOk(y + fw) && this.isEmpty(p, to)) {
			const [toFile, toRank] = this.getFileAndRank(to);
			if (this.getRank(i) !== (p.armyIndex === 0 ? 7 : 2)) {
				//pawn normal move
				np = Position.createNextPosition(p);
				np.pieceData[i] = '';
				np.pieceData[to] = this.getCasedPieceType(p, PieceType.PAWN);
				np.halfMoveClock = 0;
				moves.push(Move.createInstance(p.fullMoveNum, p.armyIndex, i, to, new Set([MoveType.NORMAL]), `${toFile}${toRank}`, -1, null, p, np));
			} else {
				//pawn normal promotion
				[PieceType.QUEEN, PieceType.ROOK, PieceType.BISHOP, PieceType.KNIGHT].forEach(pieceType => {
					np = Position.createNextPosition(p);
					np.pieceData[i] = '';
					np.pieceData[to] = this.getCasedPieceType(p, pieceType);
					np.halfMoveClock = 0;
					moves.push(
						Move.createInstance(
							p.fullMoveNum,
							p.armyIndex,
							i,
							to,
							new Set([MoveType.NORMAL, MoveType.PROMOTION, this.getPromotionMoveType(pieceType)]),
							`${toFile}${toRank}=${pieceType.toUpperCase()}`,
							-1,
							null,
							p,
							np,
						),
					);
				});
			}
		}

		//pawn double start
		if (this.getRank(i) === (p.armyIndex === 0 ? 2 : 7)) {
			const epTargetIndex = i + 8 * fw;
			const to = i + 16 * fw;
			if (this.isEmpty(p, to) && this.isEmpty(p, epTargetIndex)) {
				const [toFile, toRank] = this.getFileAndRank(to);
				np = Position.createNextPosition(p);
				np.pieceData[i] = '';
				np.pieceData[to] = this.getCasedPieceType(p, PieceType.PAWN);
				np.epTargetIndex = epTargetIndex;
				np.halfMoveClock = 0;
				moves.push(Move.createInstance(p.fullMoveNum, p.armyIndex, i, to, new Set([MoveType.NORMAL, MoveType.PAWN_DOUBLE_START]), `${toFile}${toRank}`, -1, null, p, np));
			}
		}

		//pawn capture
		[-1, 1].forEach(d => {
			const toX = x + d;
			const toY = y + fw;
			const to = this.getIndex(toX, toY);
			const [toFile, toRank] = this.getFileAndRank(to);
			if (this.isXOk(toX) && this.isYOk(toY) && (this.belongsToArmy(p.pieceData, to, Army.flipArmyIndex(p.armyIndex)) || to == p.epTargetIndex)) {
				const [fromFile] = this.getFileAndRank(i);
				if (this.getRank(i) !== (p.armyIndex === 0 ? 7 : 2)) {
					if (to !== p.epTargetIndex) {
						//pawn simple capture
						np = Position.createNextPosition(p);
						np.pieceData[i] = '';
						np.pieceData[to] = this.getCasedPieceType(p, PieceType.PAWN);
						np.halfMoveClock = 0;
						moves.push(Move.createInstance(p.fullMoveNum, p.armyIndex, i, to, new Set([MoveType.CAPTURE]), `${fromFile}x${toFile}${toRank}`, to, null, p, np));
					} else {
						//pawn en passant capture
						const epCaptureIndex = p.epTargetIndex - 8 * fw;
						np = Position.createNextPosition(p);
						np.pieceData[i] = '';
						np.pieceData[to] = this.getCasedPieceType(p, PieceType.PAWN);
						np.pieceData[epCaptureIndex] = '';
						np.halfMoveClock = 0;
						moves.push(
							Move.createInstance(
								p.fullMoveNum,
								p.armyIndex,
								i,
								to,
								new Set([MoveType.CAPTURE, MoveType.EN_PASSANT]),
								`${fromFile}x${toFile}${toRank} e.p.`,
								epCaptureIndex,
								null,
								p,
								np,
							),
						);
					}
				} else {
					//pawn capture with promotion
					[PieceType.QUEEN, PieceType.ROOK, PieceType.BISHOP, PieceType.KNIGHT].forEach(pieceType => {
						np = Position.createNextPosition(p);
						np.pieceData[i] = '';
						np.pieceData[to] = this.getCasedPieceType(p, pieceType);
						np.halfMoveClock = 0;
						moves.push(
							Move.createInstance(
								p.fullMoveNum,
								p.armyIndex,
								i,
								to,
								new Set([MoveType.CAPTURE, MoveType.PROMOTION, this.getPromotionMoveType(pieceType)]),
								`${fromFile}x${toFile}${toRank}=${pieceType.toUpperCase()}`,
								to,
								null,
								p,
								np,
							),
						);
					});
				}
			}
		});

		return moves;
	}

	getMovesForPiece(p: Position, i: number): Move[] {
		const moves: Move[] = [];
		const [x, y] = this.getXAndY(i);
		const pieceType = p.pieceData[i].toLowerCase() as PieceType;
		const directions: number[][] = Piece.getDirections(pieceType);
		for (let d = 0; d < directions.length; d++) {
			let step = 0;
			let stop = false;
			while (!stop) {
				step++;
				const toX = x + directions[d][0] * step;
				const toY = y + directions[d][1] * step;
				const to = this.getIndex(toX, toY);
				if (!this.isXOk(toX) || !this.isYOk(toY) || this.belongsToArmy(p.pieceData, to, p.armyIndex)) {
					stop = true;
				} else {
					const [toFile, toRank] = this.getFileAndRank(to);
					if (this.isEmpty(p, to)) {
						//piece move
						const np = Position.createNextPosition(p);
						np.pieceData[i] = '';
						np.pieceData[to] = this.getCasedPieceType(p, pieceType);
						moves.push(
							Move.createInstance(p.fullMoveNum, p.armyIndex, i, to, new Set([MoveType.NORMAL]), `${pieceType.toUpperCase()}${toFile}${toRank}`, -1, null, p, np),
						);
					} else if (this.belongsToArmy(p.pieceData, to, Army.flipArmyIndex(p.armyIndex))) {
						//piece capture
						const np = Position.createNextPosition(p);
						np.pieceData[i] = '';
						np.pieceData[to] = this.getCasedPieceType(p, pieceType);
						np.halfMoveClock = 0;
						moves.push(
							Move.createInstance(p.fullMoveNum, p.armyIndex, i, to, new Set([MoveType.CAPTURE]), `${pieceType.toUpperCase()}x${toFile}${toRank}`, to, null, p, np),
						);
						stop = true;
					}
				}
				if (!stop && !Piece.isLongRange(pieceType)) {
					stop = true;
				}
			}
		}
		return moves;
	}

	resolveOneAmbiguousMoveName(moves: Move[]) {
		const files = new Set<string>();
		const ranks = new Set<number>();
		moves.forEach(m => {
			const [f, r] = this.getFileAndRank(m.from);
			files.add(f);
			ranks.add(r);
		});
		if (files.size === moves.length) {
			moves.forEach(m => {
				const [f] = this.getFileAndRank(m.from);
				m.name = m.name[0] + f + m.name.slice(1, m.name.length);
			});
		} else if (ranks.size === moves.length) {
			moves.forEach(m => {
				const [, r] = this.getFileAndRank(m.from);
				m.name = m.name[0] + r + m.name.slice(1, m.name.length);
			});
		} else {
			moves.forEach(m => {
				const [f, r] = this.getFileAndRank(m.from);
				m.name = m.name[0] + f + r + m.name.slice(1, m.name.length);
			});
		}
	}

	resolveAllAmbiguousMoveNames(moves: Move[]) {
		const moveNames = new Set<string>();
		const ambiguousNames = new Set<string>();
		moves.forEach(m => {
			if (!moveNames.has(m.name)) {
				moveNames.add(m.name);
			} else {
				ambiguousNames.add(m.name);
			}
		});
		ambiguousNames.forEach(name => {
			this.resolveOneAmbiguousMoveName(moves.filter(m => m.name === name));
		});
	}

	updateCastlingOptions(p: Position, moves: Move[]) {
		moves.forEach(m => {
			if (m.from === 60) {
				m.newPosition.castlingOptions[0][0] = false;
				m.newPosition.castlingOptions[0][1] = false;
			} else if ([m.from, m.to].includes(63)) {
				m.newPosition.castlingOptions[0][0] = false;
			} else if ([m.from, m.to].includes(56)) {
				m.newPosition.castlingOptions[0][1] = false;
			} else if (m.from === 4) {
				m.newPosition.castlingOptions[1][0] = false;
				m.newPosition.castlingOptions[1][1] = false;
			} else if ([m.from, m.to].includes(7)) {
				m.newPosition.castlingOptions[1][0] = false;
			} else if ([m.from, m.to].includes(0)) {
				m.newPosition.castlingOptions[1][1] = false;
			}
		});
	}

	getCastlingMoves(p: Position): Move[] {
		const moves: Move[] = [];
		if (p.armyIndex === 0 && p.castlingOptions[0][0] && !p.pieceData[61] && !p.pieceData[62] && !this.areSquareAttacked(p, [60, 61, 62], 1)) {
			const np = Position.createNextPosition(p);
			np.pieceData[60] = '';
			np.pieceData[61] = 'R';
			np.pieceData[62] = 'K';
			np.pieceData[63] = '';
			np.castlingOptions[0][0] = false;
			np.castlingOptions[0][1] = false;
			moves.push(Move.createInstance(p.fullMoveNum, p.armyIndex, 60, 62, new Set([MoveType.CASTLING, MoveType.CASTLING_KS]), `O-O`, -1, { from: 63, to: 61 }, p, np));
		}
		if (p.armyIndex === 0 && p.castlingOptions[0][1] && !p.pieceData[57] && !p.pieceData[58] && !p.pieceData[59] && !this.areSquareAttacked(p, [58, 59, 60], 1)) {
			const np = Position.createNextPosition(p);
			np.pieceData[56] = '';
			np.pieceData[58] = 'K';
			np.pieceData[59] = 'R';
			np.pieceData[60] = '';
			np.castlingOptions[0][0] = false;
			np.castlingOptions[0][1] = false;
			moves.push(Move.createInstance(p.fullMoveNum, p.armyIndex, 60, 58, new Set([MoveType.CASTLING, MoveType.CASTLING_QS]), `O-O-O`, -1, { from: 56, to: 59 }, p, np));
		}
		if (p.armyIndex === 1 && p.castlingOptions[1][0] && !p.pieceData[5] && !p.pieceData[6] && !this.areSquareAttacked(p, [4, 5, 6], 0)) {
			const np = Position.createNextPosition(p);
			np.pieceData[4] = '';
			np.pieceData[5] = 'r';
			np.pieceData[6] = 'k';
			np.pieceData[7] = '';
			np.castlingOptions[1][0] = false;
			np.castlingOptions[1][1] = false;
			moves.push(Move.createInstance(p.fullMoveNum, p.armyIndex, 4, 6, new Set([MoveType.CASTLING, MoveType.CASTLING_KS]), `O-O`, -1, { from: 7, to: 5 }, p, np));
		}
		if (p.armyIndex === 1 && p.castlingOptions[1][1] && !p.pieceData[1] && !p.pieceData[2] && !p.pieceData[3] && !this.areSquareAttacked(p, [2, 3, 4], 0)) {
			const np = Position.createNextPosition(p);
			np.pieceData[0] = '';
			np.pieceData[2] = 'k';
			np.pieceData[3] = 'r';
			np.pieceData[4] = '';
			np.castlingOptions[1][0] = false;
			np.castlingOptions[1][1] = false;
			moves.push(Move.createInstance(p.fullMoveNum, p.armyIndex, 4, 2, new Set([MoveType.CASTLING, MoveType.CASTLING_QS]), `O-O-O`, -1, { from: 0, to: 3 }, p, np));
		}
		return moves;
	}

	removeKingAttackedMoves(p: Position, moves: Move[]) {
		let move: Move;
		const myArmyIndex = p.armyIndex;
		const attackerArmyIndex = Army.flipArmyIndex(myArmyIndex);
		const myKingLetter: string = this.getCasedPieceType(p, PieceType.KING);
		for (let index = 0; index < moves.length; index++) {
			move = moves[index];
			const myKingIndex = move.newPosition.pieceData.findIndex(p => p === myKingLetter);
			if (myKingIndex >= 0 && this.isSquareAttacked(move.newPosition, myKingIndex, attackerArmyIndex)) {
				moves.splice(index, 1);
			}
		}
	}

	getAllPossibleMoves(p: Position): Move[] {
		const moves: Move[] = [];
		for (let i = 0; i < p.pieceData.length; i++) {
			if (!p.pieceData[i] || (p.pieceData && this.belongsToArmy(p.pieceData, i, Army.flipArmyIndex(p.armyIndex)))) {
				continue;
			}
			if (this.isPieceOfType(p, i, PieceType.PAWN)) {
				moves.push(...this.getMovesForPawn(p, i));
			} else {
				moves.push(...this.getMovesForPiece(p, i));
			}
		}
		this.resolveAllAmbiguousMoveNames(moves);
		this.removeKingAttackedMoves(p, moves);
		if (Position.hasAnyCastlingOptions(p, p.armyIndex)) {
			this.updateCastlingOptions(p, moves);
			moves.push(...this.getCastlingMoves(p));
		}
		return moves;
	}
}
