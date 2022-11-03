import { Game } from './game';
import { UiLog } from './ui/ui-log';
import { UiWelcome } from './ui/ui-welcome';
import { UiMain } from './ui/ui-main';

let game: Game | null = null;
let uiMain: UiMain | null = null;

function init() {
	const uiWelcome = new UiWelcome();
	uiWelcome.init(handleWelcomeDone);
}

function handleWelcomeDone(fenStr: string, player0Type, player0Name, player1Type, player1Name) {
	const startTime = new Date().getTime();
	UiLog.startTime = startTime;
	game = new Game(player0Type, player0Name, player1Type, player1Name, fenStr, startTime, handleGameUpdate, handlePieceNameChange);
	uiMain = new UiMain(game);
	uiMain.createGameUI();
	game.start();
}

function handleGameUpdate() {
	if (uiMain) {
		uiMain.updateUI();
	}
}

function handlePieceNameChange(oldName: string, newName: string) {
	if (uiMain) {
		uiMain.changePieceName(oldName, newName);
	}
}

init();
