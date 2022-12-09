import { Game } from './model/game';
import { UiLog } from './ui/ui-log';
import { UiWelcome } from './ui/ui-welcome';
import { UiMain } from './ui/ui-main';
import { UiPieceDesign } from './ui/ui-design';
import { PlayerGenderType, PlayerType } from './model/player';

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
	shouldMarkPossibleMoves: boolean,
	isBoardFlipped: boolean,
) {
	if (window.innerWidth <= 900) {
		const doc = document.documentElement;
		const requestFullScreenFunc = doc.requestFullscreen || doc['webkitRequestFullscreen'] || doc['mozRequestFullScreen'] || doc['msFullscreenEnabled'];
		if (requestFullScreenFunc) {
			try {
				requestFullScreenFunc();
				screen.orientation.lock('portrait-primary').then(() => {
					setDocHeight();
				});
			} catch (err) {
				console.log(err);
			}
		}
	}
	const startTime = new Date().getTime();
	UiLog.startTime = startTime;
	game = new Game(player0Type, player0Gender, player0Name, player1Type, player1Gender, player1Name, fenStr);
	window['game'] = game;
	uiMain = new UiMain(game, isBoardFlipped, pieceDesign, shouldMarkPossibleMoves);
	uiMain.startGame(startTime);
}

async function init() {
	window.addEventListener('resize', setDocHeight);
	setDocHeight();
	const uiWelcome = new UiWelcome();
	uiWelcome.showDialog(handleDoneWelcomeDialog);
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
init().then(() => {});
