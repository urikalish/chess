import { Helper } from './helper';

export class Position {
	pieceData: string[] = [];
	armyIndex = 0;
	castlingOptions: boolean[][] = [
		[true, true],
		[true, true],
	];
	epTargetIndex = -1;
	halfMoveClock = 0;
	fullMoveNum = 1;

	constructor(pieceData: string[], armyIndex: number, castlingOptions: boolean[][], epTargetIndex: number, halfMoveClock: number, fullMoveNum: number) {
		this.fullMoveNum = fullMoveNum;
		this.armyIndex = armyIndex;
		this.castlingOptions = [
			[castlingOptions[0][0], castlingOptions[0][1]],
			[castlingOptions[1][0], castlingOptions[1][1]],
		];
		this.epTargetIndex = epTargetIndex;
		this.pieceData = pieceData;
		this.halfMoveClock = halfMoveClock;
	}

	static createNextPosition(p: Position) {
		return new Position(
			[...p.pieceData],
			Helper.flipArmyIndex(p.armyIndex),
			[
				[p.castlingOptions[0][0], p.castlingOptions[0][1]],
				[p.castlingOptions[1][0], p.castlingOptions[1][1]],
			],
			-1,
			p.halfMoveClock + 1,
			p.armyIndex === 0 ? p.fullMoveNum : p.fullMoveNum + 1,
		);
	}

	static hasAnyCastlingOptions(p: Position, armyIndex: number) {
		return armyIndex === 0 ? p.castlingOptions[0][0] || p.castlingOptions[0][1] : p.castlingOptions[1][0] || p.castlingOptions[1][1];
	}
}
