import { ColorType, MoveType, PieceType, PieceTypeCased } from './types';
import { Helper } from './helper';

export class Piece {
	armyIndex: number;
	color: ColorType;
	type: PieceType;
	typeCased: PieceTypeCased;
	name: string;

	constructor(armyIndex: number, pieceType: PieceType) {
		this.armyIndex = armyIndex;
		this.color = armyIndex === 0 ? ColorType.WHITE : ColorType.BLACK;
		this.type = pieceType;
		this.typeCased = armyIndex === 0 ? (pieceType.toUpperCase() as PieceTypeCased) : (pieceType.toLowerCase() as PieceTypeCased);
		this.name = `${this.typeCased}.${Helper.getRandomNumber(111111, 999999)}`;
	}

	static promote(piece: Piece, toType: PieceType) {
		if (piece.type !== PieceType.PAWN) {
			return;
		}
		piece.type = toType;
		piece.typeCased = piece.armyIndex === 0 ? (toType.toUpperCase() as PieceTypeCased) : (toType.toLowerCase() as PieceTypeCased);
		piece.name = piece.typeCased + piece.name.slice(1, piece.name.length);
	}

	static promoteByMoveType(piece: Piece, moveTypes: Set<MoveType>) {
		if (moveTypes.has(MoveType.PROMOTION_TO_Q)) {
			Piece.promote(piece, PieceType.QUEEN);
		} else if (moveTypes.has(MoveType.PROMOTION_TO_R)) {
			Piece.promote(piece, PieceType.ROOK);
		} else if (moveTypes.has(MoveType.PROMOTION_TO_B)) {
			Piece.promote(piece, PieceType.BISHOP);
		} else if (moveTypes.has(MoveType.PROMOTION_TO_N)) {
			Piece.promote(piece, PieceType.KNIGHT);
		}
	}

	static isLongRange(pieceType: PieceType) {
		return [PieceType.QUEEN, PieceType.ROOK, PieceType.BISHOP].includes(pieceType);
	}

	static getDirections(pieceType) {
		switch (pieceType) {
			case PieceType.KNIGHT: {
				return [
					[-2, -1],
					[-2, 1],
					[-1, -2],
					[-1, 2],
					[1, -2],
					[1, 2],
					[2, -1],
					[2, 1],
				];
			}
			case PieceType.BISHOP: {
				return [
					[-1, -1],
					[-1, 1],
					[1, -1],
					[1, 1],
				];
			}
			case PieceType.ROOK: {
				return [
					[0, -1],
					[0, 1],
					[-1, 0],
					[1, 0],
				];
			}
			case PieceType.QUEEN: {
				return [
					[-1, -1],
					[-1, 0],
					[-1, 1],
					[0, -1],
					[0, 1],
					[1, -1],
					[1, 0],
					[1, 1],
				];
			}
			case PieceType.KING: {
				return [
					[-1, -1],
					[-1, 0],
					[-1, 1],
					[0, -1],
					[0, 1],
					[1, -1],
					[1, 0],
					[1, 1],
				];
			}
			default: {
				return [];
			}
		}
	}
}
