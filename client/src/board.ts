import { Square } from './square';
import { Piece } from './piece';

export class Board {
	squares: Square[];

	constructor() {
		this.squares = [];
		for (let i = 0; i < 64; i++) {
			this.addSquare(i);
		}
	}

	addSquare(squareIndex: number): Square {
		const square = new Square(squareIndex);
		this.squares.push(square);
		return square;
	}

	placePiece(piece: Piece, squareIndex: number): Square {
		const square = this.squares[squareIndex];
		square.setPiece(piece);
		return square;
	}
}
