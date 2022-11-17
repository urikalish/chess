import { Piece } from './piece';

export enum SquareColor {
	LIGHT = 'light',
	DARK = 'dark',
}

export class Square {
	index: number;
	name: string;
	piece: Piece | null;

	static getNameByIndex(index: number) {
		return String.fromCharCode(97 + (index % 8)) + String(8 - Math.trunc(index / 8));
	}

	static getIndexByName(name: string) {
		return (8 - Number(name[1])) * 8 + (name[0].charCodeAt(0) - 97);
	}

	constructor(index: number) {
		this.index = index;
		this.name = Square.getNameByIndex(index);
		this.piece = null;
	}

	isOccupied() {
		return !!this.piece;
	}

	isEmpty() {
		return !this.piece;
	}

	setPiece(piece: Piece) {
		this.piece = piece;
	}

	clearPiece() {
		if (!this.piece) {
			return;
		}
		this.piece = null;
	}
}
