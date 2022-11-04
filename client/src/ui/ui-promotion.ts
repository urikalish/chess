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

		// (fenTextElm as HTMLInputElement).value = Fen.default;
		// hvhStartButtonElm.addEventListener('click', () => {
		// 	const fenStr = (fenTextElm as HTMLInputElement).value.trim() || Fen.default;
		// 	const whitePlayerName = (hvhWhiteNameElm as HTMLInputElement).value.trim() || 'Player1';
		// 	const blackPlayerName = (hvhBlackNameElm as HTMLInputElement).value.trim() || 'Player2';
		// 	onWelcomeDone(fenStr, PlayerType.HUMAN, whitePlayerName, PlayerType.HUMAN, blackPlayerName);
		// });
		// hvmPlayerIsWhiteElm.addEventListener('click', () => {
		// 	hvmPlayerIsWhiteElm.classList.add('selected');
		// 	hvmPlayerIsBlackElm.classList.remove('selected');
		// });
		// hvmPlayerIsBlackElm.addEventListener('click', () => {
		// 	hvmPlayerIsBlackElm.classList.add('selected');
		// 	hvmPlayerIsWhiteElm.classList.remove('selected');
		// });
		// hvmStartButtonElm.addEventListener('click', () => {
		// 	const fenStr = (fenTextElm as HTMLInputElement).value.trim() || Fen.default;
		// 	const playerName = (hvmPlayerNameElm as HTMLInputElement).value.trim() || 'Player1';
		// 	const isPlayerWhite = hvmPlayerIsWhiteElm.classList.contains('selected');
		// 	if (isPlayerWhite) {
		// 		onWelcomeDone(fenStr, PlayerType.HUMAN, playerName, PlayerType.COMPUTER, 'Computer');
		// 	} else {
		// 		onWelcomeDone(fenStr, PlayerType.COMPUTER, 'Computer', PlayerType.HUMAN, playerName);
		// 	}
		// });
		// mvmStartButtonElm.addEventListener('click', () => {
		// 	const fenStr = (fenTextElm as HTMLInputElement).value.trim() || Fen.default;
		// 	onWelcomeDone(fenStr, PlayerType.COMPUTER, 'Computer1', PlayerType.COMPUTER, 'Computer2');
		// });
	}
}
