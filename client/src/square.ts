import { Piece } from './piece.js';

export class Square {
	index: number;
	name: string;
	piece: Piece | null;

	static getSquareNameByIndex(index) {
		return String.fromCharCode(97 + (index % 8)) + String(8 - Math.trunc(index / 8));
	}

	constructor(index) {
		this.index = index;
		this.name = Square.getSquareNameByIndex(index);
		this.piece = null;
	}

	isOccupied() {
		return !!this.piece;
	}

	isEmpty() {
		return !this.piece;
	}

	setPiece(piece) {
		this.piece = piece;
		piece.square = this;
	}

	clearPiece() {
		if (!this.piece) {
			return;
		}
		this.piece.square = null;
		this.piece = null;
	}
}
