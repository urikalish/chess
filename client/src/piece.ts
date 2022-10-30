import { ColorType, PieceType, PieceTypeCased } from './types.js';
import { Helper } from './helper.js';

export class Piece {
	armyIndex: number;
	color: ColorType;
	type: PieceType;
	typeCased: PieceTypeCased;
	name: string;

	constructor(armyIndex: number, pieceType: PieceType) {
		this.armyIndex = armyIndex;
		this.color = armyIndex === 0 ? ColorType.WHITE : ColorType.BLACK;
		this.type = pieceType;
		this.typeCased = armyIndex === 0 ? (pieceType.toUpperCase() as PieceTypeCased) : (pieceType.toLowerCase() as PieceTypeCased);
		this.name = `${this.typeCased}.${Helper.getRandomNumber(111111, 999999)}`;
	}
}
