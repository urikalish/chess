import { Fen } from './fen.js';
import { UIHelper } from './ui-helper.js';
import { PlayerType } from './types';

export class Welcome {
	static init(onWelcomeDone) {
		const fenTextElm = UIHelper.getElm('welcome-fen-text');
		const playerNameTextElm = UIHelper.getElm('welcome-player-name-text');
		const playerWhiteElm = UIHelper.getElm('welcome-player-color-selector-white');
		const playerBlackElm = UIHelper.getElm('welcome-player-color-selector-black');
		const startButtonElm = UIHelper.getElm('welcome-start-button');

		if (!fenTextElm || !playerNameTextElm || !playerWhiteElm || !playerBlackElm || !startButtonElm) {
			return;
		}
		(fenTextElm as HTMLInputElement).value = Fen.default;
		playerWhiteElm.addEventListener('click', () => {
			playerWhiteElm.classList.add('selected');
			playerBlackElm.classList.remove('selected');
		});
		playerBlackElm.addEventListener('click', () => {
			playerBlackElm.classList.add('selected');
			playerWhiteElm.classList.remove('selected');
		});
		startButtonElm.addEventListener('click', () => {
			const fenStr = (fenTextElm as HTMLInputElement).value || Fen.default;
			const playerName = (playerNameTextElm as HTMLInputElement).value || 'Player1';
			const isPlayerWhite = playerWhiteElm.classList.contains('selected');
			if (isPlayerWhite) {
				onWelcomeDone(fenStr, PlayerType.HUMAN, playerName, PlayerType.COMPUTER, 'Computer');
			} else {
				onWelcomeDone(fenStr, PlayerType.COMPUTER, 'Computer', PlayerType.HUMAN, playerName);
			}
		});
	}
}
