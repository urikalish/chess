import { Fen } from '../fen';
import { Position } from '../position';
import { UiHelper } from './ui-helper';

export class UiFen {
	static updateFenUI(position: Position | null) {
		const infoFenElm = UiHelper.getElm('info-fen');
		if (infoFenElm) {
			infoFenElm.innerText = position ? Fen.getFenStr(position) : '';
		}
	}
}
