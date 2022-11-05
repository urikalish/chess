import { Helper } from './helper';

export class Position {
	pieceData: string[] = [];
	armyIndex = 0;
	epTargetIndex = -1;
	halfMoveClock = 0;
	fullMoveNum = 1;

	constructor(pieceData: string[], armyIndex: number, epTargetIndex: number, halfMoveClock: number, fullMoveNum: number) {
		this.fullMoveNum = fullMoveNum;
		this.armyIndex = armyIndex;
		this.epTargetIndex = epTargetIndex;
		this.pieceData = pieceData;
		this.halfMoveClock = halfMoveClock;
	}

	createNextPosition() {
		return new Position([...this.pieceData], Helper.flipArmyIndex(this.armyIndex), -1, this.halfMoveClock + 1, this.armyIndex === 0 ? this.fullMoveNum : this.fullMoveNum + 1);
	}
}
