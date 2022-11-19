import { Move } from '../model/move';

export class BotHelper {
	static randomOrder(moves: Move[]) {
		let rnd, tmp;
		for (let i = moves.length - 1; i > 0; i--) {
			rnd = Math.trunc(Math.random() * i);
			tmp = moves[i];
			moves[i] = moves[rnd];
			moves[rnd] = tmp;
		}
	}
}
