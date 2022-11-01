import { Move } from './move';
import { Position } from './position';
import { MoveType, PieceType } from './types';

export class Engine {
	getForwardDirection(armyIndex: number): number {
		return armyIndex === 0 ? -1 : 1;
	}
	getCol(i: number): number {
		return i % 8;
	}
	getRow(i: number): number {
		return Math.trunc(i / 8);
	}
	getColAndRow(i: number) {
		return [i % 8, Math.trunc(i / 8)];
	}
	isColOk(c: number): boolean {
		return c >= 0 && c <= 7;
	}
	isRowOk(r: number): boolean {
		return r >= 0 && r <= 7;
	}
	getIndex(c: number, r: number): number {
		return r * 8 + c;
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

	getAllPossibleMoves(p: Position): Move[] {
		const moves: Move[] = [];
		for (let i = 0; i < p.pieceData.length; i++) {
			const pd = p.pieceData[i];
			if (!pd) {
				continue;
			}
			const pieceColorIndex = pd === pd.toUpperCase() ? 0 : 1;
			if (pieceColorIndex !== p.activeArmyIndex) {
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
		const [c, r] = this.getColAndRow(i);
		const fw = this.getForwardDirection(p.activeArmyIndex);

		//single step
		const to = this.getIndex(c, r + fw);
		if (this.isRowOk(r + fw) && this.isEmpty(p, to)) {
			moves.push(new Move(p.fullMoveNumber, p.activeArmyIndex, i, to, MoveType.NORMAL));
		}

		//double step
		const pawnsStartRow = p.activeArmyIndex === 0 ? 6 : 1;
		if (this.getRow(i) === pawnsStartRow) {
			const to = i + 16 * fw;
			if (this.isEmpty(p, to)) {
				moves.push(new Move(p.fullMoveNumber, p.activeArmyIndex, i, to, MoveType.PAWN_2S));
			}
		}

		//captures
		[-1, 1].forEach(d => {
			const toCol = c + d;
			const toRow = r + fw;
			const to = this.getIndex(toCol, toRow);
			if (this.isColOk(toCol) && this.isRowOk(toRow) && this.isEnemyPiece(p, to)) {
				moves.push(new Move(p.fullMoveNumber, p.activeArmyIndex, i, to, MoveType.CAPTURE));
			}
		});

		return moves;
	}
	getMovesForKnight(p: Position, i: number): Move[] {
		const moves: Move[] = [];
		const [c, r] = this.getColAndRow(i);
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
			const toCol = c + directions[d][0];
			const toRow = r + directions[d][1];
			const to = this.getIndex(toCol, toRow);
			if (!this.isColOk(toCol) || !this.isRowOk(toRow) || this.isMyPiece(p, to)) {
				continue;
			}
			if (this.isEmpty(p, to)) {
				moves.push(new Move(p.fullMoveNumber, p.activeArmyIndex, i, to, MoveType.NORMAL));
			} else if (this.isEnemyPiece(p, to)) {
				moves.push(new Move(p.fullMoveNumber, p.activeArmyIndex, i, to, MoveType.CAPTURE));
			}
		}
		return moves;
	}
	getMovesForBishop(p: Position, i: number): Move[] {
		const moves: Move[] = [];
		const [c, r] = this.getColAndRow(i);
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
				const toCol = c + directions[d][0] * step;
				const toRow = r + directions[d][1] * step;
				const to = this.getIndex(toCol, toRow);
				if (!this.isColOk(toCol) || !this.isRowOk(toRow) || this.isMyPiece(p, to)) {
					stop = true;
				} else if (this.isEmpty(p, to)) {
					moves.push(new Move(p.fullMoveNumber, p.activeArmyIndex, i, to, MoveType.NORMAL));
				} else if (this.isEnemyPiece(p, to)) {
					moves.push(new Move(p.fullMoveNumber, p.activeArmyIndex, i, to, MoveType.CAPTURE));
					stop = true;
				}
			}
		}
		return moves;
	}
	getMovesForRook(p: Position, i: number): Move[] {
		const moves: Move[] = [];
		const [c, r] = this.getColAndRow(i);
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
				const toCol = c + directions[d][0] * step;
				const toRow = r + directions[d][1] * step;
				const to = this.getIndex(toCol, toRow);
				if (!this.isColOk(toCol) || !this.isRowOk(toRow) || this.isMyPiece(p, to)) {
					stop = true;
				} else if (this.isEmpty(p, to)) {
					moves.push(new Move(p.fullMoveNumber, p.activeArmyIndex, i, to, MoveType.NORMAL));
				} else if (this.isEnemyPiece(p, to)) {
					moves.push(new Move(p.fullMoveNumber, p.activeArmyIndex, i, to, MoveType.CAPTURE));
					stop = true;
				}
			}
		}
		return moves;
	}
	getMovesForQueen(p: Position, i: number): Move[] {
		const moves: Move[] = [];
		const [c, r] = this.getColAndRow(i);
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
				const toCol = c + directions[d][0] * step;
				const toRow = r + directions[d][1] * step;
				const to = this.getIndex(toCol, toRow);
				if (!this.isColOk(toCol) || !this.isRowOk(toRow) || this.isMyPiece(p, to)) {
					stop = true;
				} else if (this.isEmpty(p, to)) {
					moves.push(new Move(p.fullMoveNumber, p.activeArmyIndex, i, to, MoveType.NORMAL));
				} else if (this.isEnemyPiece(p, to)) {
					moves.push(new Move(p.fullMoveNumber, p.activeArmyIndex, i, to, MoveType.CAPTURE));
					stop = true;
				}
			}
		}
		return moves;
	}
	getMovesForKing(p: Position, i: number): Move[] {
		const moves: Move[] = [];
		const [c, r] = this.getColAndRow(i);
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
			const toCol = c + directions[d][0];
			const toRow = r + directions[d][1];
			const to = this.getIndex(toCol, toRow);
			if (!this.isColOk(toCol) || !this.isRowOk(toRow) || this.isMyPiece(p, to)) {
				continue;
			}
			if (this.isEmpty(p, to)) {
				moves.push(new Move(p.fullMoveNumber, p.activeArmyIndex, i, to, MoveType.NORMAL));
			} else if (this.isEnemyPiece(p, to)) {
				moves.push(new Move(p.fullMoveNumber, p.activeArmyIndex, i, to, MoveType.CAPTURE));
			}
		}
		return moves;
	}
}
