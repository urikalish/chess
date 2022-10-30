import { MoveType } from './types.js';

export class Move {
	type: MoveType = MoveType.NA;
	wholeTurnId = 1;
	armyIndex = 0;
	pieceName = '';
	from = -1;
	to = -1;
	capturedPieceName = '';

	constructor(wholeTurnId: number, armyIndex: number, pieceName: string, srcSquareIndex: number, dstSquareIndex: number) {
		this.wholeTurnId = wholeTurnId;
		this.armyIndex = armyIndex;
		this.pieceName = pieceName;
		this.from = srcSquareIndex;
		this.to = dstSquareIndex;
	}
}
