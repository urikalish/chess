import { Move } from './move';
import { Position } from './position';
import { MoveType, PieceType } from './types';

export class Engine {
	static getForwardDirection(armyIndex: number): number {
		return armyIndex === 0 ? -1 : 1;
	}
	static getPieceArmyIndex(pieceTypeCased: string) {
		return pieceTypeCased === pieceTypeCased.toUpperCase() ? 0 : 1;
	}

	static getRow(i: number): number {
		return Math.trunc(i / 8);
	}
	static rowOk(row: number): boolean {
		return row >= 0 && row <= 7;
	}
	static getCol(i: number): number {
		return i % 8;
	}
	static colOk(col: number): boolean {
		return col >= 0 && col <= 7;
	}
	static getIndex(row: number, col: number): number {
		return row * 8 + col;
	}
	static indexOk(index: number): boolean {
		return index >= 0 && index <= 63;
	}

	getAllPossibleMoves(position: Position): Move[] {
		const moves: Move[] = [];
		for (let i = 0; i < position.pieceData.length; i++) {
			const pd = position.pieceData[i];
			if (!pd) {
				continue;
			}
			const pieceColorIndex = pd === pd.toUpperCase() ? 0 : 1;
			if (pieceColorIndex !== position.activeArmyIndex) {
				continue;
			}
			moves.push(...this.getMovesForPiece(position, i));
		}
		return moves;
	}

	getMovesForPiece(position: Position, i: number): Move[] {
		const pieceType = position.pieceData[i].toLowerCase();
		switch (pieceType) {
			case PieceType.PAWN: {
				return this.getMovesForPawn(position, i);
			}
			case PieceType.KNIGHT: {
				return this.getMovesForKnight(position, i);
			}
			case PieceType.BISHOP: {
				return this.getMovesForBishop(position, i);
			}
			case PieceType.ROOK: {
				return this.getMovesForRook(position, i);
			}
			case PieceType.QUEEN: {
				return this.getMovesForQueen(position, i);
			}
			case PieceType.KING: {
				return this.getMovesForKing(position, i);
			}
			default: {
				return [];
			}
		}
	}

	getMovesForPawn(position: Position, i: number): Move[] {
		const moves: Move[] = [];
		const pd = position.pieceData;
		const fw = Engine.getForwardDirection(position.activeArmyIndex);
		//single step
		let toIndex = i + 8 * fw;
		if (Engine.indexOk(toIndex) && !pd[toIndex]) {
			moves.push(new Move(position.fullMoveNumber, position.activeArmyIndex, i, toIndex, MoveType.NORMAL));
		}

		//double step
		const pawnsStartRow = position.activeArmyIndex === 0 ? 6 : 1;
		if (Engine.getRow(i) === pawnsStartRow) {
			toIndex = i + 16 * fw;
			if (Engine.indexOk(toIndex) && !pd[toIndex]) {
				moves.push(new Move(position.fullMoveNumber, position.activeArmyIndex, i, toIndex, MoveType.PAWN_2S));
			}
		}

		//captures
		[-1, 1].forEach(j => {
			toIndex = i + 8 * fw + j;
			if (Engine.indexOk(toIndex) && pd[toIndex] && Engine.getPieceArmyIndex(pd[toIndex]) !== position.activeArmyIndex) {
				moves.push(new Move(position.fullMoveNumber, position.activeArmyIndex, i, toIndex, MoveType.CAPTURE));
			}
		});
		return moves;
	}
	getMovesForKnight(position: Position, i: number): Move[] {
		const moves: Move[] = [];
		return moves;
	}
	getMovesForBishop(position: Position, i: number): Move[] {
		const moves: Move[] = [];
		return moves;
	}
	getMovesForRook(position: Position, i: number): Move[] {
		const moves: Move[] = [];
		return moves;
	}
	getMovesForQueen(position: Position, i: number): Move[] {
		const moves: Move[] = [];
		return moves;
	}
	getMovesForKing(position: Position, i: number): Move[] {
		const moves: Move[] = [];
		return moves;
	}
}
