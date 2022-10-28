import { Piece } from './piece.js';

export class Move {
	armyIndex = 0;
	wholeTurnId = 1;
	srcSquareIndex = -1;
	dstSquareIndex = -1;
	movingPiece: Piece | null = null;
	removedPiece: Piece | null = null;
	isLegal: boolean;

	constructor(wholeTurnId: number, armyIndex: number, srcSquareIndex: number, dstSquareIndex: number) {
		this.wholeTurnId = wholeTurnId;
		this.armyIndex = armyIndex;
		this.srcSquareIndex = srcSquareIndex;
		this.dstSquareIndex = dstSquareIndex;
		this.movingPiece = null;
		this.removedPiece = null;
		this.isLegal = false;
	}
}