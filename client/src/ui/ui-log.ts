import { Helper } from '../helper';
import { Move } from '../move';
import { UiHelper } from './ui-helper';

export class UiLog {
	static startTime = 0;

	static getTimeStr() {
		return `${Helper.getTimeStr(new Date().getTime() - UiLog.startTime)}`;
	}

	static logGamePhase(msg: string) {
		const panelElm = UiHelper.getElm('info-log');
		if (!panelElm) {
			return;
		}

		const lineElm: HTMLDivElement = document.createElement('div');
		lineElm.classList.add('info-log--msg-line', 'info-log--msg-line--game-phase');

		// const timeElm = document.createElement('span');
		// timeElm.classList.add('info-log--msg-part', 'info-log--msg-time');
		// timeElm.innerText = UiLog.getTimeStr();
		// lineElm.appendChild(timeElm);

		const phaseNameElm = document.createElement('span');
		phaseNameElm.classList.add('info-log--msg-part', 'info-log--msg-game-phase-name');
		phaseNameElm.innerText = msg;
		lineElm.appendChild(phaseNameElm);

		panelElm.appendChild(lineElm);

		panelElm.scrollTo(0, panelElm.scrollHeight);
	}

	static logMove(move: Move) {
		const panelElm = UiHelper.getElm('info-log');
		if (!panelElm) {
			return;
		}
		if (move.armyIndex === 0) {
			const lineElm: HTMLDivElement = document.createElement('div');
			lineElm.classList.add('info-log--msg-line', 'info-log--msg-line--move');

			const moveNumElm = document.createElement('span');
			moveNumElm.innerText = `${String(move.fullMoveNumber)})`;
			moveNumElm.classList.add('info-log--msg-part', 'info-log--msg-move', 'info-log--msg-move-number');
			lineElm.appendChild(moveNumElm);

			const whiteMoveElm = document.createElement('span');
			whiteMoveElm.innerText = move.name;
			whiteMoveElm.title = UiLog.getTimeStr();
			whiteMoveElm.classList.add('info-log--msg-part', 'info-log--msg-move');
			move.types.forEach(t => {
				whiteMoveElm.classList.add(`info-log--msg-move-${t}`);
			});
			lineElm.appendChild(whiteMoveElm);

			panelElm.appendChild(lineElm);
		} else {
			const lineElms = panelElm.querySelectorAll('.info-log--msg-line--move');
			const lineElm = lineElms[lineElms.length - 1];

			const blackMoveElm = document.createElement('span');
			blackMoveElm.innerText = move.name;
			blackMoveElm.title = UiLog.getTimeStr();
			blackMoveElm.classList.add('info-log--msg-part', 'info-log--msg-move');
			move.types.forEach(t => {
				blackMoveElm.classList.add(`info-log--msg-move-${t}`);
			});
			lineElm.appendChild(blackMoveElm);
		}
		panelElm.scrollTo(0, panelElm.scrollHeight);
	}
}
