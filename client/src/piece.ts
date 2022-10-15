import { ColorType, PieceType } from './types.js';
import { Helper } from './helper.js';

export class Piece {
	armyIndex: number;
	color: ColorType;
	type: PieceType;
	name: string;

	constructor(armyIndex, pieceType) {
		this.armyIndex = armyIndex;
		this.color = armyIndex === 0 ? ColorType.WHITE : ColorType.BLACK;
		this.type = pieceType;
		this.name = `${this.color === ColorType.WHITE ? pieceType.toUpperCase() : pieceType.toLowerCase()}.${Helper.getRandomNumber(11111, 99999)}`;
	}
}
