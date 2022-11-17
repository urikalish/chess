import { Game } from './game';
import { UiLog } from './ui/ui-log';
import { UiWelcome } from './ui/ui-welcome';
import { UiMain } from './ui/ui-main';
import { UiPieceDesign } from './ui/ui-types';
import { GameResult, PlayerGenderType, PlayerType } from './types';
import { Fen } from './fen';

let game: Game | null = null;
let uiMain: UiMain | null = null;

function setDocHeight() {
	document.documentElement.style.setProperty('--doc-height', `${window.innerHeight}px`);
}

function goBotVsBotSingleGame(numOfMatches: number, matchNumber: number, result: number[]) {
	let game;
	const i = matchNumber - 1;
	const startTime = new Date().getTime();
	if (i % 2 === 0) {
		game = new Game(PlayerType.BOT, PlayerGenderType.NA, 'BotA', PlayerType.BOT, PlayerGenderType.NA, 'Bot B', Fen.default);
	} else {
		game = new Game(PlayerType.BOT, PlayerGenderType.NA, 'BotB', PlayerType.BOT, PlayerGenderType.NA, 'Bot A', Fen.default);
	}
	game.startGame(startTime);
	while (!game.isEnded()) {
		const m = game.getBotMove();
		if (m) {
			game.move(m);
		}
	}
	const endTime = new Date().getTime();
	const indexes = [i % 2 === 0 ? 0 : 1, i % 2 === 0 ? 1 : 0];
	if (game.results.has(GameResult.WIN_BY_WHITE)) {
		result[indexes[0]]++;
	} else if (game.results.has(GameResult.WIN_BY_BLACK)) {
		result[indexes[1]]++;
	} else {
		result[0] += 0.5;
		result[1] += 0.5;
	}
	const gameDurationMs = endTime - startTime;
	console.log(`[${i}]\t[${gameDurationMs}ms]\t[${game.resultStr}]\t[BotA wins: ${((result[0] / matchNumber) * 100).toFixed(2)}%]`);
	if (matchNumber < numOfMatches) {
		setTimeout(() => {
			goBotVsBotSingleGame(numOfMatches, matchNumber + 1, result);
		}, 0);
	}
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
		goBotVsBotSingleGame(100, 1, [0, 0]);
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
