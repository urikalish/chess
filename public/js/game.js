import {Board} from "./board.js";
import {Fen} from "./fen.js";

export class Game {

	constructor(players) {
		this.players = players;
		this.board = new Board();
	}

	start(startingFen, onGameUpdate) {
		const fen = Fen.parseFenStr(startingFen);
		this.board.updatePieces(fen.boardPieces);
		onGameUpdate(this);
	}
}
