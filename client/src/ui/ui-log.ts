import { Helper } from '../helper';
import { Move } from '../move';
import { UiHelper } from './ui-helper';

export class UiLog {
	static startTime = 0;

	static logGamePhase(msg: string) {
		const panelElm = UiHelper.getElm('info-log');
		if (!panelElm) {
			return;
		}
		const msgElm = document.createElement('div');
		msgElm.classList.add('info-log-msg', 'info-log-msg-game-phase');
		msgElm.innerText = `${Helper.getTimeStr(new Date().getTime() - UiLog.startTime)} - ${msg}`;
		msgElm.setAttribute('title', msg);
		panelElm.appendChild(msgElm);
		panelElm.scrollTo(0, panelElm.scrollHeight);
	}

	static logMove(move: Move) {
		const panelElm = UiHelper.getElm('info-log');
		if (!panelElm) {
			return;
		}
		let msgElm;
		if (move.armyIndex === 0) {
			msgElm = document.createElement('div');
			msgElm.classList.add('info-log-msg', 'info-log-msg-move');
			msgElm.innerText = `${move.fullMoveNumber}. ${move.name}`;
			panelElm.appendChild(msgElm);
		} else {
			const msgElms = panelElm.querySelectorAll('.info-log-msg-move');
			msgElm = msgElms[msgElms.length - 1];
			msgElm.innerText += ` ${move.name}`;
		}
		panelElm.scrollTo(0, panelElm.scrollHeight);
	}
}
