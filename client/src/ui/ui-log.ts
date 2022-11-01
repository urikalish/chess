import { Helper } from '../helper';
import { Move } from '../move';
import { UiHelper } from './ui-helper';

export class UiLog {
	static startTime = 0;

	static getTimeStr() {
		return `${Helper.getTimeStr(new Date().getTime() - UiLog.startTime)}`;
	}

	static createMoveElm(move) {
		const movePartClass = 'info-log--move-part';
		const moveNameClass = 'info-log--move-name';
		const moveTypeClassPrefix = 'info-log--move-type-';
		const elm = document.createElement('span');
		elm.innerText = move.name;
		elm.title = UiLog.getTimeStr();
		elm.classList.add(movePartClass, moveNameClass);
		move.types.forEach(t => {
			elm.classList.add(`${moveTypeClassPrefix}${t}`);
		});
		return elm;
	}

	static logMove(move: Move) {
		const panelElm = UiHelper.getElm('info-log');
		if (!panelElm) {
			return;
		}
		const fullMoveClass = 'info-log--full-move';
		const movePartClass = 'info-log--move-part';
		const moveNumberClass = 'info-log--move-number';
		if (move.armyIndex === 0) {
			const fullMoveElm: HTMLDivElement = document.createElement('div');
			fullMoveElm.classList.add(fullMoveClass);

			const moveNumElm = document.createElement('span');
			moveNumElm.innerText = `${String(move.fullMoveNumber)})`;
			moveNumElm.classList.add(movePartClass, moveNumberClass);
			fullMoveElm.appendChild(moveNumElm);

			const whiteMoveElm = UiLog.createMoveElm(move);
			fullMoveElm.appendChild(whiteMoveElm);

			panelElm.appendChild(fullMoveElm);
		} else {
			const fullMoveElms = panelElm.querySelectorAll(`.${fullMoveClass}`);
			const fullMoveElm = fullMoveElms[fullMoveElms.length - 1];

			const blackMoveElm = UiLog.createMoveElm(move);

			fullMoveElm.appendChild(blackMoveElm);
		}
		panelElm.scrollTo(0, panelElm.scrollHeight);
	}
}
