import { Fen } from '../fen';
import { Position } from '../position';
import { UiHelper } from './ui-helper';

export class UiFen {
	static updateFenUI(position: Position | null) {
		const infoFenTextElm = UiHelper.getElm('info-fen-text');
		if (infoFenTextElm) {
			infoFenTextElm.innerText = position ? Fen.getFenStr(position) : '';
		}
	}
}
