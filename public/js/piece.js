import {PieceType} from "./piece-type.js";

export class Piece {

	static getNameFromOneLetter(letter) {
		let name;
		switch (letter.toLowerCase()) {
			case 'p': {
				name = PieceType.PAWN;
				break;
			}
			case 'n': {
				name = PieceType.KNIGHT;
				break;
			}
			case 'b': {
				name = PieceType.BISHOP;
				break;
			}
			case 'r': {
				name = PieceType.ROOK;
				break;
			}
			case 'q': {
				name = PieceType.QUEEN;
				break;
			}
			case 'k': {
				name = PieceType.KING;
				break;
			}
			default: {
				name = PieceType.NA;
			}
		}
		return name;
	}

}
