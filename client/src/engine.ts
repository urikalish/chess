import { MoveType, PieceType } from './types';
import { Piece } from './piece';
import { Move } from './move';
import { Position } from './position';

export class Engine {
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
	isMyPiece(p: Position, i: number): boolean {
		return !!p.pieceData[i] && (p.pieceData[i] === p.pieceData[i].toUpperCase() ? 0 : 1) === p.armyIndex;
	}
	isEnemyPiece(p: Position, i: number): boolean {
		return !!p.pieceData[i] && (p.pieceData[i] === p.pieceData[i].toUpperCase() ? 0 : 1) !== p.armyIndex;
	}
	hasPiece(p: Position, i: number): boolean {
		return !!p.pieceData[i];
	}
	isEmpty(p: Position, i: number): boolean {
		return !p.pieceData[i];
	}
	isPawn(p: Position, i: number): boolean {
		return p.pieceData[i].toLowerCase() === PieceType.PAWN;
	}
	getCasedPieceType(p: Position, pieceType: PieceType) {
		return p.armyIndex === 0 ? pieceType.toUpperCase() : pieceType.toLowerCase();
	}

	//endregion

	//region Ambiguous Move Names

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

	//endregion

	getAllPossibleMoves(p: Position): Move[] {
		const moves: Move[] = [];
		for (let i = 0; i < p.pieceData.length; i++) {
			if (!p.pieceData[i] || this.isEnemyPiece(p, i)) {
				continue;
			}
			if (this.isPawn(p, i)) {
				moves.push(...this.getMovesForPawn(p, i));
			} else {
				moves.push(...this.getMovesForPiece(p, i));
			}
		}
		this.resolveAllAmbiguousMoveNames(moves);
		return moves;
	}

	getMovesForPawn(p: Position, i: number): Move[] {
		const moves: Move[] = [];
		const [x, y] = this.getXAndY(i);
		const fw = this.getForwardDirection(p.armyIndex);
		let np;

		//single step
		const to = this.getIndex(x, y + fw);
		if (this.isYOk(y + fw) && this.isEmpty(p, to)) {
			const [toFile, toRank] = this.getFileAndRank(to);
			if (this.getRank(i) !== (p.armyIndex === 0 ? 7 : 2)) {
				//normal
				np = p.createNextPosition();
				np.pieceData[i] = '';
				np.pieceData[to] = this.getCasedPieceType(p, PieceType.PAWN);
				moves.push(new Move(p.fullMoveNum, p.armyIndex, i, to, new Set([MoveType.NORMAL]), `${toFile}${toRank}`, p, np));
			} else {
				//normal promotion
				np = p.createNextPosition();
				np.pieceData[i] = '';
				np.pieceData[to] = this.getCasedPieceType(p, PieceType.QUEEN);
				moves.push(new Move(p.fullMoveNum, p.armyIndex, i, to, new Set([MoveType.NORMAL, MoveType.PROMOTION, MoveType.PROMOTION_TO_Q]), `${toFile}${toRank}=Q`, p, np));
				np = p.createNextPosition();
				np.pieceData[i] = '';
				np.pieceData[to] = this.getCasedPieceType(p, PieceType.ROOK);
				moves.push(new Move(p.fullMoveNum, p.armyIndex, i, to, new Set([MoveType.NORMAL, MoveType.PROMOTION, MoveType.PROMOTION_TO_R]), `${toFile}${toRank}=R`, p, np));
				np = p.createNextPosition();
				np.pieceData[i] = '';
				np.pieceData[to] = this.getCasedPieceType(p, PieceType.BISHOP);
				moves.push(new Move(p.fullMoveNum, p.armyIndex, i, to, new Set([MoveType.NORMAL, MoveType.PROMOTION, MoveType.PROMOTION_TO_B]), `${toFile}${toRank}=B`, p, np));
				np = p.createNextPosition();
				np.pieceData[i] = '';
				np.pieceData[to] = this.getCasedPieceType(p, PieceType.KNIGHT);
				moves.push(new Move(p.fullMoveNum, p.armyIndex, i, to, new Set([MoveType.NORMAL, MoveType.PROMOTION, MoveType.PROMOTION_TO_N]), `${toFile}${toRank}=N`, p, np));
			}
		}

		//double step
		if (this.getRank(i) === (p.armyIndex === 0 ? 2 : 7)) {
			const onTheWay = i + 8 * fw;
			const to = i + 16 * fw;
			if (this.isEmpty(p, to) && this.isEmpty(p, onTheWay)) {
				const [toFile, toRank] = this.getFileAndRank(to);
				np = p.createNextPosition();
				np.pieceData[i] = '';
				np.pieceData[to] = this.getCasedPieceType(p, PieceType.PAWN);
				moves.push(new Move(p.fullMoveNum, p.armyIndex, i, to, new Set([MoveType.NORMAL, MoveType.PAWN_BIG_START]), `${toFile}${toRank}`, p, np));
			}
		}

		//captures
		[-1, 1].forEach(d => {
			const toX = x + d;
			const toY = y + fw;
			const to = this.getIndex(toX, toY);
			const [toFile, toRank] = this.getFileAndRank(to);
			if (this.isXOk(toX) && this.isYOk(toY) && this.isEnemyPiece(p, to)) {
				const [fromFile] = this.getFileAndRank(i);
				if (this.getRank(i) !== (p.armyIndex === 0 ? 7 : 2)) {
					//capture
					np = p.createNextPosition();
					np.pieceData[i] = '';
					np.pieceData[to] = this.getCasedPieceType(p, PieceType.PAWN);
					moves.push(new Move(p.fullMoveNum, p.armyIndex, i, to, new Set([MoveType.CAPTURE]), `${fromFile}x${toFile}${toRank}`, p, np));
				} else {
					//capture with promotion
					np = p.createNextPosition();
					np.pieceData[i] = '';
					np.pieceData[to] = this.getCasedPieceType(p, PieceType.QUEEN);
					moves.push(
						new Move(
							p.fullMoveNum,
							p.armyIndex,
							i,
							to,
							new Set([MoveType.CAPTURE, MoveType.PROMOTION, MoveType.PROMOTION_TO_Q]),
							`${fromFile}x${toFile}${toRank}=Q`,
							p,
							np,
						),
					);
					np = p.createNextPosition();
					np.pieceData[i] = '';
					np.pieceData[to] = this.getCasedPieceType(p, PieceType.ROOK);
					moves.push(
						new Move(
							p.fullMoveNum,
							p.armyIndex,
							i,
							to,
							new Set([MoveType.CAPTURE, MoveType.PROMOTION, MoveType.PROMOTION_TO_R]),
							`${fromFile}x${toFile}${toRank}=R`,
							p,
							np,
						),
					);
					np = p.createNextPosition();
					np.pieceData[i] = '';
					np.pieceData[to] = this.getCasedPieceType(p, PieceType.BISHOP);
					moves.push(
						new Move(
							p.fullMoveNum,
							p.armyIndex,
							i,
							to,
							new Set([MoveType.CAPTURE, MoveType.PROMOTION, MoveType.PROMOTION_TO_B]),
							`${fromFile}x${toFile}${toRank}=B`,
							p,
							np,
						),
					);
					np = p.createNextPosition();
					np.pieceData[i] = '';
					np.pieceData[to] = this.getCasedPieceType(p, PieceType.KNIGHT);
					moves.push(
						new Move(
							p.fullMoveNum,
							p.armyIndex,
							i,
							to,
							new Set([MoveType.CAPTURE, MoveType.PROMOTION, MoveType.PROMOTION_TO_N]),
							`${fromFile}x${toFile}${toRank}=N`,
							p,
							np,
						),
					);
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
				if (!this.isXOk(toX) || !this.isYOk(toY) || this.isMyPiece(p, to)) {
					stop = true;
				} else {
					const [toFile, toRank] = this.getFileAndRank(to);
					if (this.isEmpty(p, to)) {
						const np = p.createNextPosition();
						np.pieceData[i] = '';
						np.pieceData[to] = this.getCasedPieceType(p, pieceType);
						moves.push(new Move(p.fullMoveNum, p.armyIndex, i, to, new Set([MoveType.NORMAL]), `${pieceType.toUpperCase()}${toFile}${toRank}`, p, np));
					} else if (this.isEnemyPiece(p, to)) {
						const np = p.createNextPosition();
						np.pieceData[i] = '';
						np.pieceData[to] = this.getCasedPieceType(p, pieceType);
						moves.push(new Move(p.fullMoveNum, p.armyIndex, i, to, new Set([MoveType.CAPTURE]), `${pieceType.toUpperCase()}x${toFile}${toRank}`, p, np));
						stop = true;
					}
				}
				if (!Piece.isLongRange(pieceType)) {
					stop = true;
				}
			}
		}
		return moves;
	}
}
