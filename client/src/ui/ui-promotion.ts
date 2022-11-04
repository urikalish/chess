import { UiHelper } from './ui-helper';
import { MoveType } from '../types';

export class UiPromotion {
	init(armyIndex: number, onPromotionDialogDone: (MoveType) => void) {
		const promotionPanel = UiHelper.getElm('promotion-panel');
		const promotionOptionWhite = UiHelper.getElm('promotion-options--white');
		const promotionOptionBlack = UiHelper.getElm('promotion-options--black');
		if (!promotionPanel || !promotionOptionWhite || !promotionOptionBlack) {
			return;
		}
		const promotionOptionElms = UiHelper.queryElms('.promotion-option');
		promotionOptionElms.forEach(elm => {
			elm.addEventListener('click', event => {
				promotionPanel.classList.add('none');
				switch (event.target.dataset.pieceType) {
					case 'q': {
						onPromotionDialogDone(MoveType.PROMOTION_TO_QUEEN);
						break;
					}
					case 'r': {
						onPromotionDialogDone(MoveType.PROMOTION_TO_ROOK);
						break;
					}
					case 'b': {
						onPromotionDialogDone(MoveType.PROMOTION_TO_BISHOP);
						break;
					}
					case 'n': {
						onPromotionDialogDone(MoveType.PROMOTION_TO_KNIGHT);
						break;
					}
					default: {
						onPromotionDialogDone(MoveType.NA);
					}
				}
			});
		});
		if (armyIndex === 0) {
			promotionOptionWhite.classList.remove('none');
			promotionOptionBlack.classList.add('none');
		} else {
			promotionOptionWhite.classList.add('none');
			promotionOptionBlack.classList.remove('none');
		}
		promotionPanel.classList.remove('none');
	}
}
