import { Fen } from './fen.js';
import { Game } from './game.js';
import { UIHelper } from './ui-helper.js';
import { Welcome } from './welcome.js';
import { UserMsgType } from './types';
import { UILog } from './ui-log';

let game: Game | null = null;

function handleGameUpdate(game) {
	UIHelper.updateBoard(game.board);
}

function handleWelcomeDone(fenStr, player0Type, player0Name, player1Type, player1Name) {
	const startTime = new Date().getTime();
	UILog.startTime = startTime;
	const fen = Fen.parseFenStr(fenStr);
	game = new Game(player0Type, player0Name, player1Type, player1Name, handleGameUpdate);
	game.startTime = startTime;
	UIHelper.game = game;
	game.applyFen(fen);
	UILog.log(`FEN loaded: ${fenStr}`, UserMsgType.FEN_TEXT);
	UIHelper.createGameUI(game);
	UILog.log('Start game', UserMsgType.GAME_PHASE);
	game.start();
}

function init() {
	Welcome.init(handleWelcomeDone);
}

init();
