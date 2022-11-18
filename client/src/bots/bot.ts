import { Bot0 } from './bot0';
import { Bot1 } from './bot1';
import { Position } from '../model/position';

export class Bot {
	static bots = {
		bot0: new Bot0(),
		bot1: new Bot1(),
	};

	static getBotMove(botName: string, p: Position) {
		return Bot.bots[botName].getMove(p);
	}
}
