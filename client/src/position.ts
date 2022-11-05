import { Helper } from './helper';

export class Position {
	pieceData: string[] = [];
	armyIndex = 0;
	halfMoveClock = 0;
	fullMoveNum = 1;

	constructor(pieceData: string[], armyIndex: number, halfMoveClock: number, fullMoveNum: number) {
		this.fullMoveNum = fullMoveNum;
		this.armyIndex = armyIndex;
		this.pieceData = pieceData;
		this.halfMoveClock = halfMoveClock;
	}

	createNextPosition() {
		return new Position([...this.pieceData], Helper.flipArmyIndex(this.armyIndex), this.halfMoveClock + 1, this.armyIndex === 0 ? this.fullMoveNum : this.fullMoveNum + 1);
	}
}
