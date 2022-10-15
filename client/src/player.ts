import { PlayerType } from './types.js';

export class Player {
	index: number;
	playerType: PlayerType;
	name: string;

	constructor(index, playerType, name) {
		this.index = index;
		this.playerType = playerType;
		this.name = name;
	}
}
