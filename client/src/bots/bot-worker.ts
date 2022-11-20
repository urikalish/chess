import { Bot0 } from './bot0';
import { Position } from '../model/position';
import { Move } from '../model/move';
import { Bot1 } from './bot1';
import { Bot2 } from './bot2';
import { Bot3 } from './bot3';
import { Bot4 } from './bot4';

export class BotWorker {
	static bots = {
		bot0: new Bot0(),
		bot1: new Bot1(),
		bot2: new Bot2(),
		bot3: new Bot3(),
		bot4: new Bot4(),
	};

	static getMove(botName: string, p: Position): Move | null {
		return BotWorker.bots[botName].getMove(p);
	}
}

onmessage = e => {
	const [botName, position] = e.data;
	const m = BotWorker.getMove(botName, position);
	postMessage({ name: m?.name || '' });
};
