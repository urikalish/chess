import { Position } from '../model/position';
import { Move } from '../model/move';
import { Bot } from './bot';

export class BotWorker {
	static bots = {
		bot1: new Bot(1, false, BotWorker.handleBotProgress),
		bot2: new Bot(2, false, BotWorker.handleBotProgress),
		bot3: new Bot(3, false, BotWorker.handleBotProgress),
		bot4: new Bot(4, true, BotWorker.handleBotProgress),
	};

	static goComputeMove(botName: string, p: Position, moveNames: string[]): Move | null {
		return BotWorker.bots[botName].goComputeMove(p, moveNames);
	}

	static handleBotProgress(progress: number, moveName: string) {
		postMessage({ progress, moveName });
	}
}

onmessage = e => {
	BotWorker.goComputeMove(e.data.botName, e.data.position, e.data.moveNames);
};
