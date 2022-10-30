export class Position {
	pieceData: string[] = [];
	activeArmyIndex = 0;
	fullMoveNumber = 1;

	constructor(activeArmyIndex: number, fullMoveNumber: number) {
		this.pieceData = [];
		this.activeArmyIndex = activeArmyIndex;
		this.fullMoveNumber = fullMoveNumber;
	}
}
