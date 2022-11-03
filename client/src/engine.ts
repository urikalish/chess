import { Move } from './move';
import { Position } from './position';
import { MoveType, PieceType } from './types';

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
			const pd = p.pieceData[i];
			if (!pd) {
				continue;
			}
			const pieceXorIndex = pd === pd.toUpperCase() ? 0 : 1;
			if (pieceXorIndex !== p.armyIndex) {
				continue;
			}
			moves.push(...this.getMovesForPiece(p, i));
		}
		this.resolveAllAmbiguousMoveNames(moves);
		return moves;
	}

	getMovesForPiece(p: Position, i: number): Move[] {
		const pieceType = p.pieceData[i].toLowerCase();
		switch (pieceType) {
			case PieceType.PAWN: {
				return this.getMovesForPawn(p, i);
			}
			case PieceType.KNIGHT: {
				return this.getMovesForKnight(p, i);
			}
			case PieceType.BISHOP: {
				return this.getMovesForBishop(p, i);
			}
			case PieceType.ROOK: {
				return this.getMovesForRook(p, i);
			}
			case PieceType.QUEEN: {
				return this.getMovesForQueen(p, i);
			}
			case PieceType.KING: {
				return this.getMovesForKing(p, i);
			}
			default: {
				return [];
			}
		}
	}

	getMovesForPawn(p: Position, i: number): Move[] {
		const moves: Move[] = [];
		const [x, y] = this.getXAndY(i);
		const fw = this.getForwardDirection(p.armyIndex);

		//single step
		const to = this.getIndex(x, y + fw);
		if (this.isYOk(y + fw) && this.isEmpty(p, to)) {
			const [toFile, toRank] = this.getFileAndRank(to);
			if (this.getRank(i) === (p.armyIndex === 0 ? 7 : 2)) {
				//normal promotion
				moves.push(new Move(p.fullMoveNum, p.armyIndex, i, to, new Set([MoveType.NORMAL, MoveType.PROMOTION, MoveType.PROMOTION_TO_QUEEN]), `${toFile}${toRank}=Q`));
				moves.push(new Move(p.fullMoveNum, p.armyIndex, i, to, new Set([MoveType.NORMAL, MoveType.PROMOTION, MoveType.PROMOTION_TO_ROOK]), `${toFile}${toRank}=R`));
				moves.push(new Move(p.fullMoveNum, p.armyIndex, i, to, new Set([MoveType.NORMAL, MoveType.PROMOTION, MoveType.PROMOTION_TO_BISHOP]), `${toFile}${toRank}=B`));
				moves.push(new Move(p.fullMoveNum, p.armyIndex, i, to, new Set([MoveType.NORMAL, MoveType.PROMOTION, MoveType.PROMOTION_TO_KNIGHT]), `${toFile}${toRank}=N`));
			} else {
				//normal
				moves.push(new Move(p.fullMoveNum, p.armyIndex, i, to, new Set([MoveType.NORMAL]), `${toFile}${toRank}`));
			}
		}

		//double step
		if (this.getRank(i) === (p.armyIndex === 0 ? 2 : 7)) {
			const to = i + 16 * fw;
			if (this.isEmpty(p, to)) {
				const [toFile, toRank] = this.getFileAndRank(to);
				moves.push(new Move(p.fullMoveNum, p.armyIndex, i, to, new Set([MoveType.NORMAL, MoveType.PAWN_DOUBLE_START]), `${toFile}${toRank}`));
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
				if (this.getRank(i) === (p.armyIndex === 0 ? 7 : 2)) {
					//capture with promotion
					moves.push(
						new Move(
							p.fullMoveNum,
							p.armyIndex,
							i,
							to,
							new Set([MoveType.CAPTURE, MoveType.PROMOTION, MoveType.PROMOTION_TO_QUEEN]),
							`${fromFile}x${toFile}${toRank}=Q`,
						),
					);
					moves.push(
						new Move(
							p.fullMoveNum,
							p.armyIndex,
							i,
							to,
							new Set([MoveType.CAPTURE, MoveType.PROMOTION, MoveType.PROMOTION_TO_ROOK]),
							`${fromFile}x${toFile}${toRank}=R`,
						),
					);
					moves.push(
						new Move(
							p.fullMoveNum,
							p.armyIndex,
							i,
							to,
							new Set([MoveType.CAPTURE, MoveType.PROMOTION, MoveType.PROMOTION_TO_BISHOP]),
							`${fromFile}x${toFile}${toRank}=B`,
						),
					);
					moves.push(
						new Move(
							p.fullMoveNum,
							p.armyIndex,
							i,
							to,
							new Set([MoveType.CAPTURE, MoveType.PROMOTION, MoveType.PROMOTION_TO_KNIGHT]),
							`${fromFile}x${toFile}${toRank}=N`,
						),
					);
				} else {
					//capture
					moves.push(new Move(p.fullMoveNum, p.armyIndex, i, to, new Set([MoveType.CAPTURE]), `${fromFile}x${toFile}${toRank}`));
				}
			}
		});

		return moves;
	}
	getMovesForKnight(p: Position, i: number): Move[] {
		const moves: Move[] = [];
		const [x, y] = this.getXAndY(i);
		const directions = [
			[-2, -1],
			[-2, 1],
			[-1, -2],
			[-1, 2],
			[1, -2],
			[1, 2],
			[2, -1],
			[2, 1],
		];
		for (let d = 0; d < directions.length; d++) {
			const toX = x + directions[d][0];
			const toY = y + directions[d][1];
			const to = this.getIndex(toX, toY);
			if (!this.isXOk(toX) || !this.isYOk(toY) || this.isMyPiece(p, to)) {
				continue;
			}
			const [toFile, toRank] = this.getFileAndRank(to);
			if (this.isEmpty(p, to)) {
				moves.push(new Move(p.fullMoveNum, p.armyIndex, i, to, new Set([MoveType.NORMAL]), `N${toFile}${toRank}`));
			} else if (this.isEnemyPiece(p, to)) {
				moves.push(new Move(p.fullMoveNum, p.armyIndex, i, to, new Set([MoveType.CAPTURE]), `Nx${toFile}${toRank}`));
			}
		}
		return moves;
	}
	getMovesForBishop(p: Position, i: number): Move[] {
		const moves: Move[] = [];
		const [x, y] = this.getXAndY(i);
		const directions = [
			[-1, -1],
			[-1, 1],
			[1, -1],
			[1, 1],
		];
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
						moves.push(new Move(p.fullMoveNum, p.armyIndex, i, to, new Set([MoveType.NORMAL]), `B${toFile}${toRank}`));
					} else if (this.isEnemyPiece(p, to)) {
						moves.push(new Move(p.fullMoveNum, p.armyIndex, i, to, new Set([MoveType.CAPTURE]), `Bx${toFile}${toRank}`));
						stop = true;
					}
				}
			}
		}
		return moves;
	}
	getMovesForRook(p: Position, i: number): Move[] {
		const moves: Move[] = [];
		const [x, y] = this.getXAndY(i);
		const directions = [
			[0, -1],
			[0, 1],
			[-1, 0],
			[1, 0],
		];
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
						moves.push(new Move(p.fullMoveNum, p.armyIndex, i, to, new Set([MoveType.NORMAL]), `R${toFile}${toRank}`));
					} else if (this.isEnemyPiece(p, to)) {
						moves.push(new Move(p.fullMoveNum, p.armyIndex, i, to, new Set([MoveType.CAPTURE]), `Rx${toFile}${toRank}`));
						stop = true;
					}
				}
			}
		}
		return moves;
	}
	getMovesForQueen(p: Position, i: number): Move[] {
		const moves: Move[] = [];
		const [x, y] = this.getXAndY(i);
		const directions = [
			[-1, -1],
			[-1, 0],
			[-1, 1],
			[0, -1],
			[0, 1],
			[1, -1],
			[1, 0],
			[1, 1],
		];
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
						moves.push(new Move(p.fullMoveNum, p.armyIndex, i, to, new Set([MoveType.NORMAL]), `Q${toFile}${toRank}`));
					} else if (this.isEnemyPiece(p, to)) {
						moves.push(new Move(p.fullMoveNum, p.armyIndex, i, to, new Set([MoveType.CAPTURE]), `Qx${toFile}${toRank}`));
						stop = true;
					}
				}
			}
		}
		return moves;
	}
	getMovesForKing(p: Position, i: number): Move[] {
		const moves: Move[] = [];
		const [x, y] = this.getXAndY(i);
		const directions = [
			[-1, -1],
			[-1, 0],
			[-1, 1],
			[0, -1],
			[0, 1],
			[1, -1],
			[1, 0],
			[1, 1],
		];
		for (let d = 0; d < directions.length; d++) {
			const toX = x + directions[d][0];
			const toY = y + directions[d][1];
			const to = this.getIndex(toX, toY);
			if (!this.isXOk(toX) || !this.isYOk(toY) || this.isMyPiece(p, to)) {
				continue;
			}
			const [toFile, toRank] = this.getFileAndRank(to);
			if (this.isEmpty(p, to)) {
				moves.push(new Move(p.fullMoveNum, p.armyIndex, i, to, new Set([MoveType.NORMAL]), `K${toFile}${toRank}`));
			} else if (this.isEnemyPiece(p, to)) {
				moves.push(new Move(p.fullMoveNum, p.armyIndex, i, to, new Set([MoveType.CAPTURE]), `Kx${toFile}${toRank}`));
			}
		}
		return moves;
	}
}
