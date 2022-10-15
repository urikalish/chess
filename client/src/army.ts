import { ColorType, PlayerType } from './types';
import { Piece } from './piece.js';

export class Army {
	index: number;
	color: ColorType;
	playerType: PlayerType;
	pieces: Piece[];

	constructor(index, playerType) {
		this.index = index;
		this.color = index === 0 ? ColorType.WHITE : ColorType.BLACK;
		this.playerType = playerType;
		this.pieces = [];
	}
}
