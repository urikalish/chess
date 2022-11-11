import { Game } from './game';
import { UiLog } from './ui/ui-log';
import { UiWelcome } from './ui/ui-welcome';
import { UiMain } from './ui/ui-main';

let game: Game | null = null;
let uiMain: UiMain | null = null;

function setDocHeight() {
	document.documentElement.style.setProperty('--doc-height', `${window.innerHeight}px`);
}

function init() {
	window.addEventListener('resize', setDocHeight);
	setDocHeight();
	UiWelcome.showDialog((fenStr: string, player0Type, player0Name, player1Type, player1Name) => {
		const startTime = new Date().getTime();
		UiLog.startTime = startTime;
		game = new Game(player0Type, player0Name, player1Type, player1Name, fenStr, startTime);
		uiMain = new UiMain(game);
		uiMain.createGameUI();
	});
}

init();
