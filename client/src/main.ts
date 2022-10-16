import { Fen } from './fen.js';
import { Game } from './game.js';
import { UIHelper } from './ui-helper.js';
import { Welcome } from './welcome.js';
import { UserMsgType } from './types';

let game: Game | null = null;

function handleGameUpdate(game) {
	UIHelper.placePieces(game.board);
}

function handleWelcomeDone(fenStr, player0Type, player0Name, player1Type, player1Name) {
	const startTime = new Date().getTime();
	const fen = Fen.parseFenStr(fenStr);
	game = new Game(player0Type, player0Name, player1Type, player1Name, handleGameUpdate);
	game.startTime = startTime;
	UIHelper.startTime = startTime;
	UIHelper.createGameUI(game);
	game.start(fen);
	UIHelper.logUserMessage(`Load FEN: ${fenStr}`, UserMsgType.FEN_TEXT);
	UIHelper.logUserMessage('Start game', UserMsgType.GAME_PHASE);
}

function init() {
	Welcome.init(handleWelcomeDone);
}

init();
