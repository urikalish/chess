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

	addSquare(index: number): Square {
		const square = new Square(index);
		this.squares.push(square);
		return square;
	}

	placePiece(piece: Piece, index: number): Square {
		const square = this.squares[index];
		square.setPiece(piece);
		return square;
	}

	movePiece(piece: Piece, from: number, to: number): Square {
		this.squares[from].clearPiece();
		this.placePiece(piece, to);
		return this.squares[to];
	}
}
