import { Position } from '../model/position';
import { Move } from '../model/move';
import { Mover } from '../model/mover';
import { BotHelper } from './bot-helper';

export class Bot1 {
	mover: Mover = new Mover();

	getMove(p: Position): Move | null {
		const moves = this.mover.getAllPossibleMoves(p);
		if (moves.length === 0) {
			return null;
		}
		BotHelper.randomOrder(moves);
		return moves[0];
	}
}
