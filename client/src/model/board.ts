import { PieceType, PieceTypeCased, Piece } from './piece';
import { SquareColor, Square } from './square';

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

	onlyKingsLeft() {
		for (let i = 0; i < 64; i++) {
			if (!this.squares[i].piece) {
				continue;
			}
			if (this.squares[i].piece?.type !== PieceType.KING) {
				return false;
			}
		}
		return true;
	}

	onlyOnePieceLeft(pieceType: PieceType) {
		let count = 0;
		for (let i = 0; i < 64; i++) {
			if (!this.squares[i].piece) {
				continue;
			}
			if (this.squares[i].piece?.type !== PieceType.KING && this.squares[i].piece?.type !== pieceType) {
				return false;
			}
			if (this.squares[i].piece?.type === pieceType) {
				count++;
				if (count > 1) {
					return false;
				}
			}
		}
		return count === 1;
	}

	getSquareColor(i): SquareColor {
		const [x, y] = [i % 8, Math.trunc(i / 8)];
		if (y % 2 === 0) {
			return x % 2 === 0 ? SquareColor.LIGHT : SquareColor.DARK;
		} else {
			return x % 2 === 0 ? SquareColor.DARK : SquareColor.LIGHT;
		}
	}

	onlyTwoSameColorBishopsLeft() {
		let whiteBishopIndex = -1;
		let blackBishopIndex = -1;
		for (let i = 0; i < 64; i++) {
			if (!this.squares[i].piece) {
				continue;
			}
			if (this.squares[i].piece?.type !== PieceType.KING && this.squares[i].piece?.type !== PieceType.BISHOP) {
				return false;
			}
			if (this.squares[i].piece?.typeCased === PieceTypeCased.WHITE_BISHOP) {
				if (whiteBishopIndex === -1) {
					whiteBishopIndex = i;
				} else {
					return false;
				}
			} else if (this.squares[i].piece?.typeCased === PieceTypeCased.BLACK_BISHOP) {
				if (blackBishopIndex === -1) {
					blackBishopIndex = i;
				} else {
					return false;
				}
			}
		}
		return whiteBishopIndex !== -1 && blackBishopIndex !== -1 && this.getSquareColor(whiteBishopIndex) === this.getSquareColor(blackBishopIndex);
	}
}
