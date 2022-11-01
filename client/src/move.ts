import { MoveType } from './types';

export class Move {
	types: Set<MoveType>;
	fullMoveNumber = 1;
	armyIndex = 0;
	from = -1;
	to = -1;
	name = '';

	constructor(fullMoveNumber: number, armyIndex: number, from: number, to: number, types: Set<MoveType>, name: string) {
		this.fullMoveNumber = fullMoveNumber;
		this.armyIndex = armyIndex;
		this.from = from;
		this.to = to;
		this.types = types;
		this.name = name;
	}
}
