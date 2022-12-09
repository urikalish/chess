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

async function lockScreenOrientation() {
	try {
		await screen.orientation.lock('portrait-primary');
	} catch (err) {
		alert.log(err);
	}
}

// async function lockScreenOrientation() {
// 	await screen.orientation.lock('portrait-primary');
// }

// function goBotVsBotSingleGame(numOfMatches: number, matchNumber: number, result: number[]) {
// 	const i = matchNumber - 1;
// 	const startTime = new Date().getTime();
// 	const game = new Game(PlayerType.BOT, PlayerGenderType.NA, 'bot0', PlayerType.BOT, PlayerGenderType.NA, 'bot1', Fen.default);
// 	game.startGame(startTime);
// 	while (!game.isEnded()) {
// 		const p = game.getCurPosition();
// 		if (!p) {
// 			break;
// 		}
// 		const m = game.getBotMove();
// 		if (m) {
// 			game.move(m);
// 		}
// 	}
// 	const endTime = new Date().getTime();
// 	if (game.results.has(GameResult.WIN_BY_WHITE)) {
// 		result[0]++;
// 	} else if (game.results.has(GameResult.WIN_BY_BLACK)) {
// 		result[1]++;
// 	} else {
// 		result[0] += 0.5;
// 		result[1] += 0.5;
// 	}
// 	const gameDurationMs = endTime - startTime;
// 	console.log(`[${i < 10 ? '0' : ''}${i}]\t[${gameDurationMs}ms]\t[${result[0]}-${result[1]}]\t[${game.resultStr}]`);
// 	if (matchNumber < numOfMatches) {
// 		setTimeout(() => {
// 			goBotVsBotSingleGame(numOfMatches, matchNumber + 1, result);
// 		}, 0);
// 	}
// }

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
	// botsMatch: boolean,
) {
	// if (botsMatch && player0Type === PlayerType.BOT && player1Type === PlayerType.BOT) {
	// 	goBotVsBotSingleGame(100, 1, [0, 0]);
	// } else {
	const startTime = new Date().getTime();
	UiLog.startTime = startTime;
	game = new Game(player0Type, player0Gender, player0Name, player1Type, player1Gender, player1Name, fenStr);
	window['game'] = game;
	uiMain = new UiMain(game, isBoardFlipped, pieceDesign, shouldMarkPossibleMoves);
	uiMain.startGame(startTime);
	// }
}

async function init() {
	window.addEventListener('resize', setDocHeight);
	if (window.innerWidth <= 900) {
		await lockScreenOrientation();
	}
	setDocHeight();
	const uiWelcome = new UiWelcome();
	uiWelcome.showDialog(handleDoneWelcomeDialog);
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
init().then(() => {});
