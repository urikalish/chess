import { Move } from './move';
import { Position } from './position';
import { MoveType, PieceType } from './types';

export class Engine {
	//region Helper methods

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
		return !!p.pieceData[i] && (p.pieceData[i] === p.pieceData[i].toUpperCase() ? 0 : 1) === p.activeArmyIndex;
	}
	isEnemyPiece(p: Position, i: number): boolean {
		return !!p.pieceData[i] && (p.pieceData[i] === p.pieceData[i].toUpperCase() ? 0 : 1) !== p.activeArmyIndex;
	}
	hasPiece(p: Position, i: number): boolean {
		return !!p.pieceData[i];
	}
	isEmpty(p: Position, i: number): boolean {
		return !p.pieceData[i];
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
			if (pieceXorIndex !== p.activeArmyIndex) {
				continue;
			}
			moves.push(...this.getMovesForPiece(p, i));
		}
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
		const fw = this.getForwardDirection(p.activeArmyIndex);

		//single step
		const to = this.getIndex(x, y + fw);
		if (this.isYOk(y + fw) && this.isEmpty(p, to)) {
			const [toFile, toRank] = this.getFileAndRank(to);
			moves.push(new Move(p.fullMoveNumber, p.activeArmyIndex, i, to, MoveType.NORMAL, `${toFile}${toRank}`));
		}

		//double step
		const pawnsStartY = p.activeArmyIndex === 0 ? 6 : 1;
		if (this.getY(i) === pawnsStartY) {
			const to = i + 16 * fw;
			if (this.isEmpty(p, to)) {
				const [toFile, toRank] = this.getFileAndRank(to);
				moves.push(new Move(p.fullMoveNumber, p.activeArmyIndex, i, to, MoveType.PAWN_2S, `${toFile}${toRank}`));
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
				moves.push(new Move(p.fullMoveNumber, p.activeArmyIndex, i, to, MoveType.CAPTURE, `${fromFile}x${toFile}${toRank}`));
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
				moves.push(new Move(p.fullMoveNumber, p.activeArmyIndex, i, to, MoveType.NORMAL, `N${toFile}${toRank}`));
			} else if (this.isEnemyPiece(p, to)) {
				moves.push(new Move(p.fullMoveNumber, p.activeArmyIndex, i, to, MoveType.CAPTURE, `Nx${toFile}${toRank}`));
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
						moves.push(new Move(p.fullMoveNumber, p.activeArmyIndex, i, to, MoveType.NORMAL, `B${toFile}${toRank}`));
					} else if (this.isEnemyPiece(p, to)) {
						moves.push(new Move(p.fullMoveNumber, p.activeArmyIndex, i, to, MoveType.CAPTURE, `Bx${toFile}${toRank}`));
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
						moves.push(new Move(p.fullMoveNumber, p.activeArmyIndex, i, to, MoveType.NORMAL, `R${toFile}${toRank}`));
					} else if (this.isEnemyPiece(p, to)) {
						moves.push(new Move(p.fullMoveNumber, p.activeArmyIndex, i, to, MoveType.CAPTURE, `Rx${toFile}${toRank}`));
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
						moves.push(new Move(p.fullMoveNumber, p.activeArmyIndex, i, to, MoveType.NORMAL, `Q${toFile}${toRank}`));
					} else if (this.isEnemyPiece(p, to)) {
						moves.push(new Move(p.fullMoveNumber, p.activeArmyIndex, i, to, MoveType.CAPTURE, `Qx${toFile}${toRank}`));
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
				moves.push(new Move(p.fullMoveNumber, p.activeArmyIndex, i, to, MoveType.NORMAL, `K${toFile}${toRank}`));
			} else if (this.isEnemyPiece(p, to)) {
				moves.push(new Move(p.fullMoveNumber, p.activeArmyIndex, i, to, MoveType.CAPTURE, `Kx${toFile}${toRank}`));
			}
		}
		return moves;
	}
}
