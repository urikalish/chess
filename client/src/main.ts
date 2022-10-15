import { Fen } from './fen.js';
import { Game } from './game.js';
import { UIHelper } from './ui-helper.js';
import { Welcome } from './welcome.js';

let game: Game | null = null;

function handleGameUpdate(game) {
	UIHelper.placePieces(game.board);
}

function handleWelcomeDone(fenStr, player0Type, player0Name, player1Type, player1Name) {
	const fen = Fen.parseFenStr(fenStr);
	game = new Game(player0Type, player0Name, player1Type, player1Name, handleGameUpdate);
	UIHelper.createGameUI(player0Type, player1Type);
	game.start(fen);
}

function init() {
	Welcome.init(handleWelcomeDone);
}

init();
