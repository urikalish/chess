import { ColorType, PieceType } from './types.js';

export class Piece {
	playerIndex: number;
	color: ColorType;
	type: PieceType;

	constructor(playerIndex, pieceType) {
		this.playerIndex = playerIndex;
		this.color = playerIndex === 0 ? ColorType.WHITE : ColorType.BLACK;
		this.type = pieceType;
	}
}
