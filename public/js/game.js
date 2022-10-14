import {Board} from "./board.js";
import {Fen} from "./fen.js";

export class Game {

	constructor(settings) {
		this.settings = settings;
		this.board = new Board(settings);
	}

	start(startingFen, onGameUpdate) {
		const fen = Fen.parseFenStr(startingFen);
		this.board.updatePieces(fen.boardPieces);
		onGameUpdate(this);
	}
}
