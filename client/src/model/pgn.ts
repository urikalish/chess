import { Game, GameResult } from './game';

export class Pgn {
	static getPgnStr(game: Game, logText: string): string {
		const date = new Date(game.startTime);
		let monthStr = date.toLocaleDateString('en-US', { month: 'numeric' });
		monthStr = monthStr.length === 1 ? '0' + monthStr : monthStr;
		let dayStr = date.toLocaleDateString('en-US', { day: 'numeric' });
		dayStr = dayStr.length === 1 ? '0' + dayStr : dayStr;
		const dateStr = `${date.toLocaleDateString('en-US', { year: 'numeric' })}.${monthStr}.${dayStr}`;
		let resultStr = '*';
		if (game.results.size > 0) {
			if (game.results.has(GameResult.WIN_BY_WHITE)) {
				resultStr = `1-0`;
			} else if (game.results.has(GameResult.WIN_BY_BLACK)) {
				resultStr = `0-1`;
			} else {
				resultStr = `1/2-1/2`;
			}
		}
		return (
			`[Event "Online Chess game"]\n` +
			`[Site "https://kalish-chess.netlify.app"]\n` +
			`[Date "${dateStr}"]\n` +
			`[Round "N/A"]\n` +
			`[White "${game.players[0].name}"]\n` +
			`[Black "${game.players[1].name}"]\n` +
			`[Result "${resultStr}"]\n\n` +
			`${logText}`
		);
	}
}
