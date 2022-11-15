import { Game } from './game';
import { UiLog } from './ui/ui-log';
import { UiWelcome } from './ui/ui-welcome';
import { UiMain } from './ui/ui-main';
import { UiPieceDesign } from './ui/ui-types';
import { PlayerGenderType, PlayerType } from './types';
import { Tester } from './tester';

let game: Game | null = null;
let uiMain: UiMain | null = null;

function setDocHeight() {
	document.documentElement.style.setProperty('--doc-height', `${window.innerHeight}px`);
}

function handleDoneWelcomeDialog(
	player0Type: PlayerType,
	player0Gender: PlayerGenderType,
	player0Name: string,
	player1Type: PlayerType,
	player1Gender: PlayerGenderType,
	player1Name: string,
	fenStr: string,
	pieceDesign: UiPieceDesign,
	isBoardFlipped: boolean,
) {
	if (player0Type === PlayerType.BOT && player1Type === PlayerType.BOT) {
		Tester.goHeadlessMatch();
	} else {
		const startTime = new Date().getTime();
		UiLog.startTime = startTime;
		game = new Game(player0Type, player0Gender, player0Name, player1Type, player1Gender, player1Name, fenStr);
		uiMain = new UiMain(game, isBoardFlipped, pieceDesign);
		uiMain.startGame(startTime);
	}
}

function init() {
	window.addEventListener('resize', setDocHeight);
	setDocHeight();
	UiWelcome.showDialog(handleDoneWelcomeDialog);
}

init();
