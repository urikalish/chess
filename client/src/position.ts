export class Position {
	fullMoveNum = 1;
	armyIndex = 0;
	pieceData: string[] = [];

	constructor(fullMoveNum: number, armyIndex: number, pieceData: string[]) {
		this.fullMoveNum = fullMoveNum;
		this.armyIndex = armyIndex;
		this.pieceData = pieceData;
	}
}
