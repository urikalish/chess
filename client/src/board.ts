import { Square } from './square.js';
import { Piece } from './piece.js';
import { Move } from './move.js';

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

	movePiece(move: Move): Move {
		move.isLegal = false;
		const srcSquare = this.squares[move.srcSquareIndex];
		const dstSquare = this.squares[move.dstSquareIndex];
		const srcPiece = srcSquare.piece;
		const dstPiece = dstSquare.piece;
		if (!srcSquare || !dstSquare || !srcPiece) {
			return move;
		}
		srcSquare.clearPiece();
		dstSquare.clearPiece();
		this.placePiece(srcPiece, move.dstSquareIndex);
		move.removedPiece = dstPiece || null;
		move.isLegal = true;
		return move;
	}
}
