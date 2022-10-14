import {ColorType} from "./color-type.js";

export class Fen {

	static default = `rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1`;

	static parseFenStr(fenStr) {
		const parts = fenStr.split(' ');
		let boardPieces = [];
		const rows = parts[0].split(`/`);
		rows.forEach(row => {
			for (let i = 0; i < row.length; i++) {
				if (['1', '2', '3', '4', '5', '6', '7', '8'].includes(row[i])) {
					boardPieces.push(...new Array(Number(row[i])).fill(''));
				} else {
					boardPieces.push(row[i]);
				}
			}
		});
		const activeColor = parts[1] === 'b' ? ColorType.BLACK : ColorType.WHITE;
		return {
			boardPieces,
			activeColor
		}
	}
}
