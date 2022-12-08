import { Position } from './position';

export enum MoveType {
	NA = '-',
	NORMAL = 'normal',
	CAPTURE = 'capture',
	CAPTURED_P = 'captured_p',
	CAPTURED_N = 'captured_n',
	CAPTURED_B = 'captured_b',
	CAPTURED_R = 'captured_r',
	CAPTURED_Q = 'captured_q',
	PAWN_DOUBLE_START = 'pawn-double-start',
	PROMOTION = 'promotion',
	PROMOTION_TO_Q = 'promotion-to-q',
	PROMOTION_TO_R = 'promotion-to-r',
	PROMOTION_TO_B = 'promotion-to-b',
	PROMOTION_TO_N = 'promotion-to-n',
	EN_PASSANT = 'en-passant',
	CASTLING = 'castling',
	CASTLING_KS = 'castling-ks',
	CASTLING_QS = 'castling-qs',
	CHECK = 'check',
	CHECKMATE = 'checkmate',
}

export class Move {
	types: Set<MoveType> = new Set();
	fullMoveNum = 1;
	armyIndex = 0;
	from = -1;
	to = -1;
	name = '';
	captureIndex = -1;
	additionalMove: { from: number; to: number } | null = null;
	oldPosition: Position = new Position();
	newPosition: Position = new Position();

	static createInstance(
		fullMoveNum: number,
		armyIndex: number,
		from: number,
		to: number,
		types: Set<MoveType>,
		name: string,
		captureIndex: number,
		additionalMove: { from: number; to: number } | null,
		oldPosition: Position,
		newPosition: Position,
	) {
		const m: Move = new Move();
		m.fullMoveNum = fullMoveNum;
		m.armyIndex = armyIndex;
		m.from = from;
		m.to = to;
		m.types = types;
		m.name = name;
		m.captureIndex = captureIndex;
		m.additionalMove = additionalMove;
		m.oldPosition = oldPosition;
		m.newPosition = newPosition;
		return m;
	}
}
