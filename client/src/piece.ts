import { ColorType, PieceType, PieceTypeCased } from './types.js';
import { Helper } from './helper.js';
import { Square } from './square';

export class Piece {
	armyIndex: number;
	color: ColorType;
	type: PieceType;
	typeCased: PieceTypeCased;
	name: string;
	square: Square | null = null;

	constructor(armyIndex, pieceType) {
		this.armyIndex = armyIndex;
		this.color = armyIndex === 0 ? ColorType.WHITE : ColorType.BLACK;
		this.type = pieceType;
		this.typeCased = armyIndex === 0 ? (pieceType.toUpperCase() as PieceTypeCased) : (pieceType.toLowerCase() as PieceTypeCased);
		this.name = `${this.typeCased}.${Helper.getRandomNumber(111111, 999999)}`;
	}

	isPlaced() {
		return !!this.square;
	}

	isUnplaced() {
		return !this.square;
	}

	setSquare(square) {
		this.square = square;
		square.piece = this;
	}

	clearSquare() {
		if (!this.square) {
			return;
		}
		this.square.piece = null;
		this.square = null;
	}
}
