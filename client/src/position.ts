export class Position {
	pieceData: string[] = [];
	armyIndex = 0;
	fullMoveNum = 1;

	constructor(armyIndex: number, fullMoveNum: number) {
		this.pieceData = [];
		this.armyIndex = armyIndex;
		this.fullMoveNum = fullMoveNum;
	}
}
