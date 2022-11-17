import { UiHelper } from './ui-helper';

export enum UiPieceDesign {
	NEO_WOOD = 'neo-wood',
	STAUNTY = 'staunty',
	GIOCO = 'gioco',
	KOSAL = 'kosal',
}

export class UiDesign {
	static uiPieceDesign: UiPieceDesign = UiPieceDesign.NEO_WOOD;

	static getUiPieceColor(index: number) {
		if (UiDesign.uiPieceDesign === UiPieceDesign.NEO_WOOD) {
			return index === 0 ? '#d8cbb9' : '#3b3430';
		} else if (UiDesign.uiPieceDesign === UiPieceDesign.KOSAL) {
			return index === 0 ? '#fff' : '#010101';
		} else if (UiDesign.uiPieceDesign === UiPieceDesign.GIOCO) {
			return index === 0 ? '#ddd1c4' : '#62564d';
		} else if (UiDesign.uiPieceDesign === UiPieceDesign.STAUNTY) {
			return index === 0 ? '#f0f0f0' : '#5f5955';
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
