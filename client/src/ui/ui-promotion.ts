import { MoveType } from '../model/move';
import { UiHelper } from './ui-helper';

export class UiPromotion {
	showDialog(armyIndex: number, onPromotionDialogDone: (MoveType) => void) {
		const promotionPanel = UiHelper.getElm('promotion-panel');
		if (!promotionPanel) {
			return;
		}
		const promotionOptionElms = UiHelper.queryElms('.promotion-option');
		promotionOptionElms.forEach(elm => {
			elm.addEventListener('click', event => {
				promotionPanel.classList.add('none');
				switch (event.target.dataset.pieceType) {
					case 'q': {
						onPromotionDialogDone(MoveType.PROMOTION_TO_Q);
						break;
					}
					case 'r': {
						onPromotionDialogDone(MoveType.PROMOTION_TO_R);
						break;
					}
					case 'b': {
						onPromotionDialogDone(MoveType.PROMOTION_TO_B);
						break;
					}
					case 'n': {
						onPromotionDialogDone(MoveType.PROMOTION_TO_N);
						break;
					}
					default: {
						onPromotionDialogDone(MoveType.NA);
					}
				}
			});
		});
		promotionPanel.classList.toggle('promotion-panel--white', armyIndex === 0);
		promotionPanel.classList.toggle('promotion-panel--black', armyIndex === 1);
		promotionPanel.classList.remove('none');
	}
}
