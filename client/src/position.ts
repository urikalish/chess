import { Helper } from './helper';

export class Position {
	fullMoveNum = 1;
	armyIndex = 0;
	pieceData: string[] = [];

	constructor(fullMoveNum: number, armyIndex: number, pieceData: string[]) {
		this.fullMoveNum = fullMoveNum;
		this.armyIndex = armyIndex;
		this.pieceData = pieceData;
	}

	createNextPosition() {
		return new Position(this.armyIndex === 0 ? this.fullMoveNum : this.fullMoveNum + 1, Helper.flipArmyIndex(this.armyIndex), [...this.pieceData]);
	}
}
