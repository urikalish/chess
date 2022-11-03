import { ColorType, PieceType, PieceTypeCased } from './types';
import { Helper } from './helper';

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

	promote(toType: PieceType) {
		if (this.type !== PieceType.PAWN) {
			return;
		}
		this.type = toType;
		this.typeCased = this.armyIndex === 0 ? (toType.toUpperCase() as PieceTypeCased) : (toType.toLowerCase() as PieceTypeCased);
		this.name = this.typeCased + this.name.slice(1, this.name.length);
	}
}
