import { PieceType } from './types.js';

export class Piece {
	color: string;
	type: PieceType;

	constructor(color, pieceType) {
		this.color = color;
		this.type = pieceType;
	}
}
