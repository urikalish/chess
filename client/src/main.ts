import { UserMsgType } from './types';
import { Game } from './game.js';
import { UILog } from './ui/ui-log';
import { UiWelcome } from './ui/ui-welcome.js';
import { UiMain } from './ui/ui-main.js';

let game: Game | null = null;

function handleGameUpdate(game: Game) {
	UiMain.updateBoardUI(game.board);
}

function handleWelcomeDone(fenStr: string, player0Type, player0Name, player1Type, player1Name) {
	const startTime = new Date().getTime();
	UILog.startTime = startTime;
	game = new Game(player0Type, player0Name, player1Type, player1Name, fenStr, startTime, handleGameUpdate);
	UiMain.createGameUI(game);
	UILog.log('Start game', UserMsgType.GAME_PHASE);
	UILog.log(`FEN loaded: ${fenStr}`, UserMsgType.FEN_TEXT);
	game.start();
}

function init() {
	UiWelcome.init(handleWelcomeDone);
}

init();
