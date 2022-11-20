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
		const colors = {
			[UiPieceDesign.GIOCO]: ['#ddd1c4', '#62564d'],
			[UiPieceDesign.NEO_WOOD]: ['#d8cbb9', '#3b3430'],
			[UiPieceDesign.KOSAL]: ['#fff', '#010101'],
			[UiPieceDesign.STAUNTY]: ['#f0f0f0', '#5f5955'],
		};
		return colors[UiDesign.uiPieceDesign][index];
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
