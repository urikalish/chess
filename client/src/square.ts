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

	placePiece(piece) {
		this.piece = piece;
	}

	removePiece() {
		this.piece = null;
	}
}
