import { Fen } from './fen.js';
import { Player } from './player.js';
import { Board } from './board.js';

export class Game {
	players: Player[];
	board: Board;

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
