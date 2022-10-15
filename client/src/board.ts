import { Square } from './square.js';

export class Board {
	squares: Square[];

	constructor() {
		this.squares = [];
		for (let i = 0; i < 64; i++) {
			this.addSquare(i);
		}
	}

	addSquare(squareIndex): Square {
		const square = new Square(squareIndex);
		this.squares.push(square);
		return square;
	}

	placePiece(squareIndex, piece): Square {
		const square = this.squares[squareIndex];
		square.placePiece(piece);
		return square;
	}
}
