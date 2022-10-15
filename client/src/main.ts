import { Game } from './game.js';
import { UIHelper } from './ui-helper.js';
import { Welcome } from './welcome.js';

let game: Game | null = null;

function handleGameUpdate(game) {
	UIHelper.placePieces(game.board);
}

function handleWelcomeDone(fenStr, player0Type, player0Name, player1Type, player1Name) {
	game = new Game(player0Type, player0Name, player1Type, player1Name);
	UIHelper.createGameUI(player0Type, player1Type);
	game.start(fenStr, handleGameUpdate);
}

function init() {
	Welcome.init(handleWelcomeDone);
}

init();
