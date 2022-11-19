import { PieceType, PieceTypeCased } from './piece';

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
			Math.abs(p.armyIndex - 1),
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

	static prohibitCastingBasedOnPiecePosition(p: Position) {
		p.castlingOptions[0][0] = p.castlingOptions[0][0] && p.pieceData[60] === 'K' && p.pieceData[63] === 'R';
		p.castlingOptions[0][1] = p.castlingOptions[0][1] && p.pieceData[60] === 'K' && p.pieceData[56] === 'R';
		p.castlingOptions[1][0] = p.castlingOptions[1][0] && p.pieceData[4] === 'k' && p.pieceData[7] === 'r';
		p.castlingOptions[1][1] = p.castlingOptions[1][1] && p.pieceData[4] === 'k' && p.pieceData[0] === 'r';
	}

	static assureTwoKings(p: Position) {
		return p.pieceData.findIndex(pd => pd === 'K') > -1 && p.pieceData.findIndex(pd => pd === 'k') > -1;
	}

	static getOnePieceCount(p: Position, pieceTypeCased: PieceTypeCased): number {
		return p.pieceData.reduce((count: number, pd: string) => {
			return pd === pieceTypeCased ? count + 1 : count;
		}, 0);
	}

	static getAllPieceCount(p: Position) {
		return [
			{
				[PieceType.PAWN]: Position.getOnePieceCount(p, PieceTypeCased.WHITE_PAWN),
				[PieceType.KNIGHT]: Position.getOnePieceCount(p, PieceTypeCased.WHITE_KNIGHT),
				[PieceType.BISHOP]: Position.getOnePieceCount(p, PieceTypeCased.WHITE_BISHOP),
				[PieceType.ROOK]: Position.getOnePieceCount(p, PieceTypeCased.WHITE_ROOK),
				[PieceType.QUEEN]: Position.getOnePieceCount(p, PieceTypeCased.WHITE_QUEEN),
			},
			{
				[PieceType.PAWN]: Position.getOnePieceCount(p, PieceTypeCased.BLACK_PAWN),
				[PieceType.KNIGHT]: Position.getOnePieceCount(p, PieceTypeCased.BLACK_KNIGHT),
				[PieceType.BISHOP]: Position.getOnePieceCount(p, PieceTypeCased.BLACK_BISHOP),
				[PieceType.ROOK]: Position.getOnePieceCount(p, PieceTypeCased.BLACK_ROOK),
				[PieceType.QUEEN]: Position.getOnePieceCount(p, PieceTypeCased.BLACK_QUEEN),
			},
		];
	}
}
