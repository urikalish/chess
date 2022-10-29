import { ColorType } from './types.js';
import { Position } from './position';

export class Fen {
	static default = `rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1`;

	static parseFenStr(fenStr): Position {
		const position = new Position();
		const parts = fenStr.split(' ');
		position.pieceData = [];
		const rows = parts[0].split(`/`);
		rows.forEach(row => {
			for (let i = 0; i < row.length; i++) {
				if (['1', '2', '3', '4', '5', '6', '7', '8'].includes(row[i])) {
					position.pieceData.push(...new Array(Number(row[i])).fill(''));
				} else {
					position.pieceData.push(row[i]);
				}
			}
		});
		position.activeColor = parts[1] === 'b' ? ColorType.BLACK : ColorType.WHITE;
		position.fullMoveNumber = parts[5];
		return position;
	}
}
