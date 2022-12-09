import { Position } from '../model/position';
import { Bot } from './bot';

export class BotWorker {
	static goComputeMove(botName: string, p: Position, moveNames: string[]) {
		const depth = Number(botName.substring(3));
		const bot = new Bot(depth, true, BotWorker.handleBotProgress);
		bot.goComputeMove(p, moveNames);
	}

	static handleBotProgress(progress: number, moveName: string) {
		postMessage({ progress, moveName });
	}
}

onmessage = e => {
	BotWorker.goComputeMove(e.data.botName, e.data.position, e.data.moveNames);
};
