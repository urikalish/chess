import { ColorType, PlayerType } from './types.js';
import { Piece } from './piece.js';

export class Army {
	index: number;
	color: ColorType;
	playerType: PlayerType;
	pieces: Piece[];

	constructor(armyIndex, playerType) {
		this.index = armyIndex;
		this.color = armyIndex === 0 ? ColorType.WHITE : ColorType.BLACK;
		this.playerType = playerType;
		this.pieces = [];
	}

	createAndAddPiece(pieceType): Piece {
		const piece = new Piece(this.index, pieceType);
		this.pieces.push(piece);
		return piece;
	}

	getPiece(name) {
		return this.pieces.find(p => p.name === name);
	}
}
