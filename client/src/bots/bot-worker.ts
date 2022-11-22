import { Position } from '../model/position';
import { Move } from '../model/move';
import { Bot } from './bot';

export class BotWorker {
	static bots = {
		bot0: new Bot(0, BotWorker.handleBotProgress),
		bot1: new Bot(1, BotWorker.handleBotProgress),
		bot2: new Bot(2, BotWorker.handleBotProgress),
		bot3: new Bot(3, BotWorker.handleBotProgress),
	};

	static goComputeMove(botName: string, p: Position): Move | null {
		return BotWorker.bots[botName].goComputeMove(p);
	}

	static handleBotProgress(progress: number, moveName: string) {
		postMessage({ progress, moveName });
	}
}

onmessage = e => {
	BotWorker.goComputeMove(e.data.botName, e.data.position);
};
