import { Square } from './square';
import { Piece } from './piece';
import { PieceTypeCased } from './types';

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

	clearPiece(index: number) {
		this.squares[index].clearPiece();
	}

	placePiece(piece: Piece, index: number) {
		const square = this.squares[index];
		square.setPiece(piece);
	}

	movePiece(piece: Piece, from: number, to: number) {
		this.squares[from].clearPiece();
		this.placePiece(piece, to);
	}

	clearSquareByPieceName(pieceName: string) {
		const index = this.squares.findIndex(s => s.piece?.name === pieceName);
		if (index > -1) {
			this.clearPiece(index);
		}
	}

	getKingIndex(armyIndex: number) {
		const myKingLetter: string = armyIndex === 0 ? PieceTypeCased.WHITE_KING : PieceTypeCased.BLACK_KING;
		return this.squares.findIndex(s => s.piece?.typeCased === myKingLetter);
	}
}
