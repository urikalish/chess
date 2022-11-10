import { Helper } from '../helper';
import { Move } from '../move';
import { UiHelper } from './ui-helper';
import { GameResult, MoveType } from '../types';

export class UiLog {
	static startTime = 0;

	static getTimeStr() {
		return `${Helper.getTimeStr(new Date().getTime() - UiLog.startTime)}`;
	}

	static classNames = {
		fullMove: 'info-log--full-move',
		movePart: 'info-log--move-part',
		moveNumber: 'info-log--move-number',
		moveName: 'info-log--move-name',
		moveTypePrefix: 'info-log--move-type-',
		gameResult: 'info-log-game-result',
	};

	static createFullMoveElm() {
		const elm: HTMLDivElement = document.createElement('div');
		elm.classList.add(UiLog.classNames.fullMove);
		return elm;
	}

	static createMoveNumberElm(fullMoveNum: number) {
		const elm = document.createElement('span');
		elm.innerText = `${String(fullMoveNum)}. `;
		elm.classList.add(UiLog.classNames.movePart, UiLog.classNames.moveNumber);
		return elm;
	}

	static createMoveElm(moveName: string, moveTypes: Set<MoveType>) {
		const elm = document.createElement('span');
		elm.innerText = `${moveName} `;
		elm.title = UiLog.getTimeStr();
		elm.classList.add(UiLog.classNames.movePart, UiLog.classNames.moveName);
		moveTypes.forEach(t => {
			elm.classList.add(`${UiLog.classNames.moveTypePrefix}${t}`);
		});
		return elm;
	}

	static logMove(move: Move) {
		const panelElm = UiHelper.getElm('info-log');
		if (!panelElm) {
			return;
		}
		if (move.armyIndex === 0) {
			const fullMoveElm = UiLog.createFullMoveElm();
			const moveNumElm = UiLog.createMoveNumberElm(move.fullMoveNum);
			const whiteMoveElm = UiLog.createMoveElm(move.name, move.types);
			fullMoveElm.appendChild(moveNumElm);
			fullMoveElm.appendChild(whiteMoveElm);
			panelElm.appendChild(fullMoveElm);
		} else {
			let fullMoveElm;
			const fullMoveElms = panelElm.querySelectorAll(`.${UiLog.classNames.fullMove}`);
			if (fullMoveElms.length > 0) {
				fullMoveElm = fullMoveElms[fullMoveElms.length - 1];
			} else {
				fullMoveElm = UiLog.createFullMoveElm();
				const moveNumElm = UiLog.createMoveNumberElm(move.fullMoveNum);
				const whiteMoveElm = UiLog.createMoveElm('...', new Set([]));
				fullMoveElm.appendChild(moveNumElm);
				fullMoveElm.appendChild(whiteMoveElm);
				panelElm.appendChild(fullMoveElm);
			}
			const blackMoveElm = UiLog.createMoveElm(move.name, move.types);
			fullMoveElm.appendChild(blackMoveElm);
		}
		panelElm.scrollTo(0, panelElm.scrollHeight);
	}

	static createGameResultElm() {
		const elm: HTMLDivElement = document.createElement('div');
		elm.classList.add(UiLog.classNames.movePart, UiLog.classNames.gameResult);
		return elm;
	}

	static logGameResult(results: Set<GameResult>) {
		const panelElm = UiHelper.getElm('info-log');
		if (!panelElm) {
			return;
		}
		const fullMoveElm = UiLog.createFullMoveElm();
		const gameResultElm = UiLog.createGameResultElm();
		if (results.has(GameResult.WIN)) {
			gameResultElm.textContent = results.has(GameResult.WIN_BY_WHITE) ? '1-0' : '0-1';
			if (results.has(GameResult.CHECKMATE)) {
				gameResultElm.textContent += ` (checkmate by ${results.has(GameResult.WIN_BY_WHITE) ? 'white' : 'black'})`;
			}
		} else if (results.has(GameResult.DRAW)) {
			gameResultElm.textContent = '½-½';
			if (results.has(GameResult.STALEMATE)) {
				gameResultElm.textContent += ` (stalemate)`;
			} else if (results.has(GameResult.FIFTY_MOVES)) {
				gameResultElm.textContent += ` (fifty moves)`;
			} else if (results.has(GameResult.THREEFOLD_REPETITION)) {
				gameResultElm.textContent += ` (threefold repetition)`;
			} else if (results.has(GameResult.INSUFFICIENT_MATERIAL)) {
				gameResultElm.textContent += ` (insufficient material)`;
			}
		}
		fullMoveElm.appendChild(gameResultElm);
		panelElm.appendChild(fullMoveElm);
	}
}
