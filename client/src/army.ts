import { ColorType, PieceType, PlayerType } from './types';
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
		for (let i = 0; i < 8; i++) {
			this.pieces.push(new Piece(armyIndex, PieceType.PAWN));
		}
		for (let i = 0; i < 2; i++) {
			this.pieces.push(new Piece(armyIndex, PieceType.KNIGHT));
		}
		for (let i = 0; i < 2; i++) {
			this.pieces.push(new Piece(armyIndex, PieceType.BISHOP));
		}
		for (let i = 0; i < 2; i++) {
			this.pieces.push(new Piece(armyIndex, PieceType.ROOK));
		}
		this.pieces.push(new Piece(armyIndex, PieceType.QUEEN));
		this.pieces.push(new Piece(armyIndex, PieceType.KING));
	}
}
