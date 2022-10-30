import { Piece } from './piece.js';
import { MoveType } from './types.js';

export class Move {
	type: MoveType = MoveType.UNKNOWN;
	wholeTurnId = 1;
	armyIndex = 0;
	from = -1;
	to = -1;
	piece: Piece | null = null;
	capturedPiece: Piece | null = null;

	constructor(wholeTurnId: number, armyIndex: number, srcSquareIndex: number, dstSquareIndex: number) {
		this.wholeTurnId = wholeTurnId;
		this.armyIndex = armyIndex;
		this.from = srcSquareIndex;
		this.to = dstSquareIndex;
	}
}
