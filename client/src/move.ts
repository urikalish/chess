import { Piece } from './piece.js';
import { MoveType } from './types.js';

export class Move {
	wholeTurnId = 1;
	armyIndex = 0;
	from = -1;
	to = -1;
	movingPiece: Piece | null = null;
	capturedPiece: Piece | null = null;
	type: MoveType = MoveType.NA;

	constructor(wholeTurnId: number, armyIndex: number, srcSquareIndex: number, dstSquareIndex: number) {
		this.wholeTurnId = wholeTurnId;
		this.armyIndex = armyIndex;
		this.from = srcSquareIndex;
		this.to = dstSquareIndex;
	}
}
