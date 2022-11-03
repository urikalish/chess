import { Helper } from '../helper';
import { Move } from '../move';
import { UiHelper } from './ui-helper';
import { MoveType } from '../types';

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
	};

	static createFullMoveElm() {
		const elm: HTMLDivElement = document.createElement('div');
		elm.classList.add(UiLog.classNames.fullMove);
		return elm;
	}

	static createMoveNumberElm(fullMoveNumber: number) {
		const elm = document.createElement('span');
		elm.innerText = `${String(fullMoveNumber)})`;
		elm.classList.add(UiLog.classNames.movePart, UiLog.classNames.moveNumber);
		return elm;
	}

	static createMoveElm(moveName: string, moveTypes: Set<MoveType>) {
		const elm = document.createElement('span');
		elm.innerText = moveName;
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
			const moveNumElm = UiLog.createMoveNumberElm(move.fullMoveNumber);
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
				const moveNumElm = UiLog.createMoveNumberElm(move.fullMoveNumber);
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
}
