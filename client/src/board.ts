import { Square } from './square.js';
import { Piece } from './piece.js';
import { Move } from './move.js';
import { MoveType } from './types';

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
		const fromSquare = this.squares[move.from];
		const toSquare = this.squares[move.to];
		const movingPiece = fromSquare.piece;
		const targetPiece = toSquare.piece;
		if (!fromSquare || !toSquare || !movingPiece) {
			move.type = MoveType.ILLEGAL;
			return move;
		}
		fromSquare.clearPiece();
		toSquare.clearPiece();
		this.placePiece(movingPiece, move.to);
		move.capturedPiece = targetPiece || null;
		move.type = move.capturedPiece ? MoveType.CAPTURE : MoveType.NORMAL;
		return move;
	}
}
