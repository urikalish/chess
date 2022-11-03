import { MoveType } from './types';

export class Move {
	types: Set<MoveType>;
	fullMoveNum = 1;
	armyIndex = 0;
	from = -1;
	to = -1;
	name = '';

	constructor(fullMoveNum: number, armyIndex: number, from: number, to: number, types: Set<MoveType>, name: string) {
		this.fullMoveNum = fullMoveNum;
		this.armyIndex = armyIndex;
		this.from = from;
		this.to = to;
		this.types = types;
		this.name = name;
	}
}
