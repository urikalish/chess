import { PieceColor } from './piece';

export enum PlayerType {
	HUMAN = 'human',
	BOT = 'bot',
}

export enum PlayerGenderType {
	NA = '-',
	MALE = 'male',
	FEMALE = 'female',
}

export class Player {
	index: number;
	color: PieceColor;
	type: PlayerType;
	gender: PlayerGenderType;
	name: string;

	constructor(index: number, type: PlayerType, gender: PlayerGenderType, name: string) {
		this.index = index;
		this.color = index === 0 ? PieceColor.WHITE : PieceColor.BLACK;
		this.type = type;
		this.gender = gender;
		this.name = name;
	}
}
