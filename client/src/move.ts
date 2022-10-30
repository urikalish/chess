import { MoveType } from './types';

export class Move {
	type: MoveType = MoveType.NA;
	wholeTurnId = 1;
	armyIndex = 0;
	from = -1;
	to = -1;
	pieceName = '';
	capturedPieceName = '';

	constructor(wholeTurnId: number, armyIndex: number, srcSquareIndex: number, dstSquareIndex: number, pieceName: string) {
		this.wholeTurnId = wholeTurnId;
		this.armyIndex = armyIndex;
		this.from = srcSquareIndex;
		this.to = dstSquareIndex;
		this.pieceName = pieceName;
	}
}
