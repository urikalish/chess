import { UiPieceDesign } from './ui-types';
import { UiHelper } from './ui-helper';

export class UiDesign {
	static uiPieceDesign: UiPieceDesign = UiPieceDesign.NEO_WOOD;

	static getUiPieceColor(index: number) {
		if (UiDesign.uiPieceDesign === UiPieceDesign.NEO_WOOD) {
			return index === 0 ? '#D8CBB9' : '#453E39';
		} else if (UiDesign.uiPieceDesign === UiPieceDesign.KOSAL) {
			return index === 0 ? '#fff' : '#000';
		} else {
			return index === 0 ? '#fff' : '#000';
		}
	}

	static setPieceDesign(design: UiPieceDesign) {
		UiDesign.uiPieceDesign = design;
		const mainElm = UiHelper.getElm('main');
		if (!mainElm) {
			return;
		}
		mainElm.classList.remove(String(UiPieceDesign.NEO_WOOD));
		mainElm.classList.remove(String(UiPieceDesign.KOSAL));
		mainElm.classList.add(String(design));
	}
}
