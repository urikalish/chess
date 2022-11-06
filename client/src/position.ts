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

	static createInstance(pieceData: string[], armyIndex: number, castlingOptions: boolean[][], epTargetIndex: number, halfMoveClock: number, fullMoveNum: number) {
		const p: Position = new Position();
		p.pieceData = pieceData;
		p.armyIndex = armyIndex;
		p.castlingOptions = [
			[castlingOptions[0][0], castlingOptions[0][1]],
			[castlingOptions[1][0], castlingOptions[1][1]],
		];
		p.epTargetIndex = epTargetIndex;
		p.halfMoveClock = halfMoveClock;
		p.fullMoveNum = fullMoveNum;
		return p;
	}

	static createNextPosition(p: Position) {
		return Position.createInstance(
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
