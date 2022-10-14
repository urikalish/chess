import {Board} from "./board.js";

export class Game {

	constructor(settings) {
		this.settings = settings;
		this.board = new Board(settings);
	}

	start(startingFen, onGameUpdate) {
		this.board.updatePieces(startingFen);
		onGameUpdate(this);
	}
}
