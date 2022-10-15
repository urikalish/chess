import { ColorType, PlayerType } from './types.js';

export class Player {
	index: number;
	color: ColorType;
	type: PlayerType;
	name: string;

	constructor(index, type, name) {
		this.index = index;
		this.color = index === 0 ? ColorType.WHITE : ColorType.BLACK;
		this.type = type;
		this.name = name;
	}
}
