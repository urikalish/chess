import { UserMsgType } from './types';
import { Helper } from './helper';

export class UILog {
	static startTime = 0;

	static getElm(id) {
		return document.getElementById(id);
	}

	static queryElm(selectors) {
		return document.querySelector(selectors);
	}

	static queryElms(selectors) {
		return document.querySelectorAll(selectors);
	}

	static log(msg: string, type: UserMsgType) {
		const panelElm = UILog.getElm('info-log');
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
