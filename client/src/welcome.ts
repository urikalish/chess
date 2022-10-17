import { PlayerType } from './types.js';
import { Fen } from './fen.js';
import { UIHelper } from './ui-helper.js';

export class Welcome {
	static init(onWelcomeDone) {
		const fenTextElm = UIHelper.getElm('welcome-fen-text');

		const hvhWhiteNameElm = UIHelper.getElm('welcome-hvh-white-name-text');
		const hvhBlackNameElm = UIHelper.getElm('welcome-hvh-black-name-text');
		const hvhStartButtonElm = UIHelper.getElm('welcome-hvh-start-button');

		const hvmPlayerNameElm = UIHelper.getElm('welcome-hvm-player-name-text');
		const hvmPlayerIsWhiteElm = UIHelper.getElm('welcome-hvm-player-color-selector-white');
		const hvmPlayerIsBlackElm = UIHelper.getElm('welcome-hvm-player-color-selector-black');
		const hvmStartButtonElm = UIHelper.getElm('welcome-hvm-start-button');

		const mvmStartButtonElm = UIHelper.getElm('welcome-mvm-start-button');

		if (
			!fenTextElm ||
			!hvhWhiteNameElm ||
			!hvhBlackNameElm ||
			!hvhStartButtonElm ||
			!hvmPlayerNameElm ||
			!hvmPlayerIsWhiteElm ||
			!hvmPlayerIsBlackElm ||
			!hvmStartButtonElm ||
			!mvmStartButtonElm
		) {
			return;
		}
		(fenTextElm as HTMLInputElement).value = Fen.default;
		hvhStartButtonElm.addEventListener('click', () => {
			const fenStr = (fenTextElm as HTMLInputElement).value || Fen.default;
			const whitePlayerName = (hvhWhiteNameElm as HTMLInputElement).value || 'Player1';
			const blackPlayerName = (hvhBlackNameElm as HTMLInputElement).value || 'Player2';
			onWelcomeDone(fenStr, PlayerType.HUMAN, whitePlayerName, PlayerType.HUMAN, blackPlayerName);
		});
		hvmPlayerIsWhiteElm.addEventListener('click', () => {
			hvmPlayerIsWhiteElm.classList.add('selected');
			hvmPlayerIsBlackElm.classList.remove('selected');
		});
		hvmPlayerIsBlackElm.addEventListener('click', () => {
			hvmPlayerIsBlackElm.classList.add('selected');
			hvmPlayerIsWhiteElm.classList.remove('selected');
		});
		hvmStartButtonElm.addEventListener('click', () => {
			const fenStr = (fenTextElm as HTMLInputElement).value || Fen.default;
			const playerName = (hvmPlayerNameElm as HTMLInputElement).value || 'Player1';
			const isPlayerWhite = hvmPlayerIsWhiteElm.classList.contains('selected');
			if (isPlayerWhite) {
				onWelcomeDone(fenStr, PlayerType.HUMAN, playerName, PlayerType.COMPUTER, 'Computer');
			} else {
				onWelcomeDone(fenStr, PlayerType.COMPUTER, 'Computer', PlayerType.HUMAN, playerName);
			}
		});
		mvmStartButtonElm.addEventListener('click', () => {
			const fenStr = (fenTextElm as HTMLInputElement).value || Fen.default;
			onWelcomeDone(fenStr, PlayerType.COMPUTER, 'Computer1', PlayerType.COMPUTER, 'Computer2');
		});
	}
}
