import { ColorType, PieceType } from './types.js';

export class Piece {
	armyIndex: number;
	color: ColorType;
	type: PieceType;

	constructor(armyIndex, pieceType) {
		this.armyIndex = armyIndex;
		this.color = armyIndex === 0 ? ColorType.WHITE : ColorType.BLACK;
		this.type = pieceType;
	}
}
