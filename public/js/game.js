import {Fen} from "./fen.js";
import {Board} from "./board.js";

export class Game {

	constructor(settings) {
		this.settings = settings;
		this.board = new Board(settings);
	}

	start(onGameUpdate) {
		this.board.updatePieces(Fen.default);
		onGameUpdate(this);
	}
}
