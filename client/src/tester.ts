import { Game } from './game';
import { Fen } from './fen';
import { GameResult, PlayerGenderType, PlayerType } from './types';

export class Tester {
	// static test(game: Game | null) {
	// 	if (!game) {
	// 		return;
	// 	}
	// 	const position = game.getCurPosition();
	// 	if (!position) {
	// 		return;
	// 	}
	// 	let resultStr = '';
	// 	let count, f;
	// 	const fs: Set<string> = new Set();
	// 	let ms: Move[] = [];
	// 	let ps: Position[] = [position];
	// 	[1, 2, 3, 4].forEach(() => {
	// 		count = 0;
	// 		ms = [];
	// 		ps.forEach(p => {
	// 			ms.push(...game.mover.getAllPossibleMoves(p));
	// 		});
	// 		ps = [];
	// 		ms.forEach(m => {
	// 			f = Fen.getFenStr(m.newPosition, false, false, false, false, false);
	// 			if (!fs.has(f)) {
	// 				fs.add(f);
	// 				ps.push(m.newPosition);
	// 				count++;
	// 			}
	// 		});
	// 		resultStr += `${count}, `;
	// 	});
	// 	alert(resultStr);
	// }

	static goSingleGame(result: number[], numOfMatches: number, matchNumber: number) {
		let game;
		const i = matchNumber - 1;
		const startTime = new Date().getTime();
		if (i % 2 === 0) {
			game = new Game(PlayerType.BOT, PlayerGenderType.NA, 'Bot A', PlayerType.BOT, PlayerGenderType.NA, 'Bot B', Fen.default);
		} else {
			game = new Game(PlayerType.BOT, PlayerGenderType.NA, 'Bot B', PlayerType.BOT, PlayerGenderType.NA, 'Bot A', Fen.default);
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
		console.log(`[${i < 10 ? '0' : ''}${i}]\t${endTime - startTime}ms\t[${game.resultStr}]\t[${result[indexes[0]]}-${result[indexes[1]]}]`);
		if (matchNumber < numOfMatches) {
			setTimeout(() => {
				Tester.goSingleGame(result, numOfMatches, matchNumber + 1);
			}, 0);
		}
	}

	static goHeadlessMatch() {
		const numOfMatches = 100;
		const result = [0, 0];
		Tester.goSingleGame(result, numOfMatches, 1);
	}
}
