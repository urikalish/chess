import { PieceType } from '../model/piece';
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
				const promotions = {
					[PieceType.QUEEN]: MoveType.PROMOTION_TO_Q,
					[PieceType.ROOK]: MoveType.PROMOTION_TO_R,
					[PieceType.BISHOP]: MoveType.PROMOTION_TO_B,
					[PieceType.KNIGHT]: MoveType.PROMOTION_TO_N,
				};
				onPromotionDialogDone(promotions[event.target.dataset.pieceType]);
			});
		});
		promotionPanel.classList.toggle('promotion-panel--white', armyIndex === 0);
		promotionPanel.classList.toggle('promotion-panel--black', armyIndex === 1);
		promotionPanel.classList.remove('none');
	}
}
