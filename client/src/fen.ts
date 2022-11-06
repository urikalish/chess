import { Position } from './position';
import { Square } from './square';

export class Fen {
	static default = `rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1`;

	static parseFenStr(fenStr): Position {
		const parts = fenStr.split(' ');
		const pd: string[] = [];
		const rows = parts[0].split(`/`);
		rows.forEach(row => {
			for (let i = 0; i < row.length; i++) {
				if (['1', '2', '3', '4', '5', '6', '7', '8'].includes(row[i])) {
					pd.push(...new Array(Number(row[i])).fill(''));
				} else {
					pd.push(row[i]);
				}
			}
		});
		const castlingOptions = [parts[2].includes('K'), parts[2].includes('Q'), parts[2].includes('k'), parts[2].includes('q')];
		const epTargetIndex = parts[3] === '-' ? -1 : Square.getIndexByName(parts[3]);
		return new Position(pd, parts[1] === 'w' ? 0 : 1, castlingOptions, epTargetIndex, Number(parts[4]), Number(parts[5]));
	}

	static getFenStr(p: Position | null) {
		if (!p) {
			return '';
		}
		const parts: string[] = [];
		const pd: string[] = [];
		let emptySquaresCount = 0;
		for (let i = 0; i < 64; i++) {
			if (i % 8 === 0) {
				if (i !== 0) {
					pd.push(`/`);
				}
				emptySquaresCount = 0;
			}
			if (p.pieceData[i]) {
				if (emptySquaresCount > 0) {
					pd.push(String(emptySquaresCount));
				}
				pd.push(p.pieceData[i]);
				emptySquaresCount = 0;
			} else {
				emptySquaresCount++;
			}
			if (i % 8 === 7 && emptySquaresCount > 0) {
				pd.push(String(emptySquaresCount));
			}
		}
		let castlingOptions = '';
		if (p.castlingOptions[0]) {
			castlingOptions += 'K';
		}
		if (p.castlingOptions[1]) {
			castlingOptions += 'Q';
		}
		if (p.castlingOptions[2]) {
			castlingOptions += 'k';
		}
		if (p.castlingOptions[3]) {
			castlingOptions += 'q';
		}
		parts[0] = pd.join('');
		parts[1] = ['w', 'b'][p.armyIndex];
		parts[2] = castlingOptions || '-';
		parts[3] = p.epTargetIndex === -1 ? '-' : Square.getNameByIndex(p.epTargetIndex);
		parts[4] = String(p.halfMoveClock);
		parts[5] = String(p.fullMoveNum);
		return parts.join(' ');
	}
}
