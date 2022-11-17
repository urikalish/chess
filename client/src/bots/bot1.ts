import { Position } from '../model/position';
import { Move } from '../model/move';
import { Mover } from '../model/mover';

export class Bot1 {
	mover: Mover = new Mover();

	getMove(p: Position): Move | null {
		if (!p) {
			return null;
		}
		const moves = this.mover.getAllPossibleMoves(p);
		if (moves.length === 0) {
			return null;
		}
		let m = moves.find(m => m.name.includes('#'));
		if (m) {
			return m;
		}
		m = moves.find(m => m.name.includes('=Q'));
		if (m) {
			return m;
		}
		m = moves.find(m => m.name.includes('x'));
		if (m) {
			return m;
		}
		return moves[Math.floor(Math.random() * moves.length)];
	}
}
