import { Fen } from '../fen';
import { Position } from '../position';
import { UiHelper } from './ui-helper';

export class UiFen {
	static updateFenUI(p: Position | null) {
		const infoFenTextElm = UiHelper.getElm('info-fen-text');
		if (infoFenTextElm) {
			infoFenTextElm.innerText = p ? Fen.getFenStr(p) : '';
		}
	}
}
