import { MoveType } from './types';
import { Position } from './position';

export class Move {
	types: Set<MoveType>;
	fullMoveNum = 1;
	armyIndex = 0;
	from = -1;
	to = -1;
	name = '';
	captureIndex = -1;
	additionalMove: { from: number; to: number } | null = null;
	oldPosition: Position;
	newPosition: Position;

	constructor(
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
		this.fullMoveNum = fullMoveNum;
		this.armyIndex = armyIndex;
		this.from = from;
		this.to = to;
		this.types = types;
		this.name = name;
		this.captureIndex = captureIndex;
		this.additionalMove = additionalMove;
		this.oldPosition = oldPosition;
		this.newPosition = newPosition;
	}
}
