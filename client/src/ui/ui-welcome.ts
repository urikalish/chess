import { PlayerType } from '../types';
import { Fen } from '../fen';
import { UiHelper } from './ui-helper';

export class UiWelcome {
	init(onWelcomeDone) {
		const fenTextElm = UiHelper.getElm('welcome-fen-text');

		const hvhWhiteNameElm = UiHelper.getElm('welcome-hvh-white-name-text');
		const hvhBlackNameElm = UiHelper.getElm('welcome-hvh-black-name-text');
		const hvhStartButtonElm = UiHelper.getElm('welcome-hvh-start-button');

		const hvmPlayerNameElm = UiHelper.getElm('welcome-hvm-player-name-text');
		const hvmPlayerIsWhiteElm = UiHelper.getElm('welcome-hvm-player-color-selector-white');
		const hvmPlayerIsBlackElm = UiHelper.getElm('welcome-hvm-player-color-selector-black');
		const hvmStartButtonElm = UiHelper.getElm('welcome-hvm-start-button');

		const mvmStartButtonElm = UiHelper.getElm('welcome-mvm-start-button');

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
			const fenStr = (fenTextElm as HTMLInputElement).value.trim() || Fen.default;
			const whitePlayerName = (hvhWhiteNameElm as HTMLInputElement).value.trim() || 'Player1';
			const blackPlayerName = (hvhBlackNameElm as HTMLInputElement).value.trim() || 'Player2';
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
			const fenStr = (fenTextElm as HTMLInputElement).value.trim() || Fen.default;
			const playerName = (hvmPlayerNameElm as HTMLInputElement).value.trim() || 'Player1';
			const isPlayerWhite = hvmPlayerIsWhiteElm.classList.contains('selected');
			if (isPlayerWhite) {
				onWelcomeDone(fenStr, PlayerType.HUMAN, playerName, PlayerType.COMPUTER, 'Computer');
			} else {
				onWelcomeDone(fenStr, PlayerType.COMPUTER, 'Computer', PlayerType.HUMAN, playerName);
			}
		});
		mvmStartButtonElm.addEventListener('click', () => {
			const fenStr = (fenTextElm as HTMLInputElement).value.trim() || Fen.default;
			onWelcomeDone(fenStr, PlayerType.COMPUTER, 'Computer1', PlayerType.COMPUTER, 'Computer2');
		});
	}
}
