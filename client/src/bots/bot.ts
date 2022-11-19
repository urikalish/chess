import { Bot0 } from './bot0';
import { Bot1 } from './bot1';
import { Position } from '../model/position';
import { Move } from '../model/move';

export class Bot {
	static bots = {
		bot0: new Bot0(),
		bot1: new Bot1(),
	};

	static getBotMove(botName: string, p: Position): Move {
		return Bot.bots[botName].getMove(p);
	}
}
