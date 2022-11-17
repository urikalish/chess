export enum PieceColor {
	WHITE = 'white',
	BLACK = 'black',
}

export enum PieceType {
	PAWN = 'p',
	KNIGHT = 'n',
	BISHOP = 'b',
	ROOK = 'r',
	QUEEN = 'q',
	KING = 'k',
}

export enum PieceTypeCased {
	WHITE_PAWN = 'P',
	WHITE_KNIGHT = 'N',
	WHITE_BISHOP = 'B',
	WHITE_ROOK = 'R',
	WHITE_QUEEN = 'Q',
	WHITE_KING = 'K',
	BLACK_PAWN = 'p',
	BLACK_KNIGHT = 'n',
	BLACK_BISHOP = 'b',
	BLACK_ROOK = 'r',
	BLACK_QUEEN = 'q',
	BLACK_KING = 'k',
}

export class Piece {
	armyIndex: number;
	color: PieceColor;
	type: PieceType;
	typeCased: PieceTypeCased;
	name: string;

	constructor(armyIndex: number, pieceType: PieceType) {
		this.armyIndex = armyIndex;
		this.color = armyIndex === 0 ? PieceColor.WHITE : PieceColor.BLACK;
		this.type = pieceType;
		this.typeCased = armyIndex === 0 ? (pieceType.toUpperCase() as PieceTypeCased) : (pieceType.toLowerCase() as PieceTypeCased);
		const min = 111111;
		const max = 999999;
		const rnd = Math.floor(Math.random() * (max - min + 1)) + min;
		this.name = `${this.typeCased}.${rnd}`;
	}

	static promote(piece: Piece, toType: PieceType) {
		if (piece.type !== PieceType.PAWN) {
			return;
		}
		piece.type = toType;
		piece.typeCased = piece.armyIndex === 0 ? (toType.toUpperCase() as PieceTypeCased) : (toType.toLowerCase() as PieceTypeCased);
		piece.name = piece.typeCased + piece.name.slice(1, piece.name.length);
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
