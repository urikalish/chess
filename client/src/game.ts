import { Fen } from './fen.js';
import { Army } from './army';
import { Player } from './player.js';
import { Board } from './board.js';

export class Game {
	players: Player[];
	armies: Army[];
	board: Board;

	constructor(player0Type, player0Name, player1Type, player1Name) {
		this.players = [new Player(0, player0Type, player0Name), new Player(1, player1Type, player1Name)];
		this.armies = [new Army(0, player0Type), new Army(1, player1Type)];
		this.board = new Board();
	}

	start(startingFen, onGameUpdate) {
		const fen = Fen.parseFenStr(startingFen);
		this.board.updatePieces(fen.boardPieces);
		onGameUpdate(this);
	}
}
