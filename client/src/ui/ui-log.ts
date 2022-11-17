import { Move, MoveType } from '../model/move';
import { UiHelper } from './ui-helper';
import { GameResult } from '../model/game';

export class UiLog {
	static startTime = 0;

	static getTimeStr() {
		const time = new Date().getTime() - UiLog.startTime;
		const totalSecs = Math.trunc(time / 1000);
		const hours = Math.trunc(totalSecs / 3600);
		const totalMinutes = totalSecs - hours * 3600;
		const minutes = Math.trunc(totalMinutes / 60);
		const secs = totalMinutes - minutes * 60;
		const hh = hours >= 10 ? hours : '0' + hours;
		const mm = minutes >= 10 ? minutes : '0' + minutes;
		const ss = secs >= 10 ? secs : '0' + secs;
		return `${hh}:${mm}:${ss}`;
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

	static logMove(move: Move | undefined) {
		if (!move) {
			return;
		}
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
		const copyMovesButtonElm = UiHelper.getElm('copy-moves-button');
		if (copyMovesButtonElm) {
			copyMovesButtonElm.classList.remove('disabled-button');
		}
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
		panelElm.scrollTo(0, panelElm.scrollHeight);
	}

	static setScrollListener() {
		const panelElm = UiHelper.getElm('info-log');
		if (!panelElm) {
			return;
		}
		panelElm.addEventListener('scroll', () => {
			const infoLogBackgroundElm = UiHelper.getElm('info-log-background');
			if (infoLogBackgroundElm) {
				infoLogBackgroundElm.classList.toggle('none', panelElm.scrollTop > 0);
			}
		});
	}
}
