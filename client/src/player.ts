import { ColorType, PlayerGenderType, PlayerType } from './types';

export class Player {
	index: number;
	color: ColorType;
	type: PlayerType;
	gender: PlayerGenderType;
	name: string;

	constructor(index: number, type: PlayerType, gender: PlayerGenderType, name: string) {
		this.index = index;
		this.color = index === 0 ? ColorType.WHITE : ColorType.BLACK;
		this.type = type;
		this.gender = gender;
		this.name = name;
	}
}
