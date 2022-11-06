import { MoveType } from './types';
import { Position } from './position';

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
