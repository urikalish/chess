import { Game } from './game';
import { Move } from './move';
import { Position } from './position';
import { Fen } from './fen';

export class Tester {
	static test(game: Game | null) {
		if (!game) {
			return;
		}
		const position = game.getCurPosition();
		if (!position) {
			return;
		}
		let resultStr = '';
		let count, f;
		const fs: Set<string> = new Set();
		let ms: Move[] = [];
		let ps: Position[] = [position];
		[1, 2, 3, 4].forEach(() => {
			count = 0;
			ms = [];
			ps.forEach(p => {
				ms.push(...game.mover.getAllPossibleMoves(p));
			});
			ps = [];
			ms.forEach(m => {
				f = Fen.getFenStr(m.newPosition, false, false, false, false, false);
				if (!fs.has(f)) {
					fs.add(f);
					ps.push(m.newPosition);
					count++;
				}
			});
			resultStr += `${count}, `;
		});
		alert(resultStr);
	}
}
