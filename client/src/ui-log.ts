import { UserMsgType } from './types';
import { Helper } from './helper';
import { UiHelper } from './ui-helper.js';

export class UILog {
	static startTime = 0;

	static log(msg: string, type: UserMsgType) {
		const panelElm = UiHelper.getElm('info-log');
		if (!panelElm) {
			return;
		}
		const msgElm = document.createElement('div');
		msgElm.classList.add('info-log-msg', String(type));
		msgElm.innerText = `${Helper.getTimeStr(new Date().getTime() - UILog.startTime)} - ${msg}`;
		msgElm.setAttribute('title', msg);
		panelElm.appendChild(msgElm);
		panelElm.scrollTo(0, panelElm.scrollHeight);
	}
}
