import { Bot0 } from './bot0';
import { Bot1 } from './bot1';
import { Position } from '../model/position';

export class Bot {
	static bots = [new Bot0(), new Bot1()];

	static getBotMove(botName: string, p: Position) {
		return Bot.bots[botName.substring(3)].getMove(p);
	}
}
