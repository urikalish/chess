import { PlayerGenderType, PlayerType } from '../types';
import { Fen } from '../fen';
import { UiHelper } from './ui-helper';
import { UiPieceDesign } from './ui-types';

export class UiWelcome {
	static showDialog(onWelcomeDone) {
		const topPlayerColorElm = UiHelper.getElm('welcome-top-player-color') as HTMLSelectElement;
		const topPlayerTypeElm = UiHelper.getElm('welcome-top-player-type') as HTMLSelectElement;
		const topPlayerNameElm = UiHelper.getElm('welcome-top-player-name') as HTMLInputElement;

		const bottomPlayerColorElm = UiHelper.getElm('welcome-bottom-player-color') as HTMLSelectElement;
		const bottomPlayerTypeElm = UiHelper.getElm('welcome-bottom-player-type') as HTMLSelectElement;
		const bottomPlayerNameElm = UiHelper.getElm('welcome-bottom-player-name') as HTMLInputElement;

		const fenTextElm = UiHelper.getElm('welcome-fen-text') as HTMLInputElement;
		const pieceDesignElm = UiHelper.getElm('welcome-piece-design') as HTMLSelectElement;

		const startButtonElm = UiHelper.getElm('welcome-start-button') as HTMLButtonElement;

		if (
			!topPlayerColorElm ||
			!topPlayerTypeElm ||
			!topPlayerNameElm ||
			!bottomPlayerColorElm ||
			!bottomPlayerTypeElm ||
			!bottomPlayerNameElm ||
			!fenTextElm ||
			!pieceDesignElm ||
			!startButtonElm
		) {
			return;
		}

		topPlayerColorElm.addEventListener('change', () => {
			bottomPlayerColorElm.value = topPlayerColorElm.value === 'white' ? 'black' : 'white';
		});
		topPlayerTypeElm.addEventListener('change', () => {
			topPlayerNameElm.value = topPlayerTypeElm.value === 'bot' ? 'Top Bot' : 'Top Player';
		});
		bottomPlayerColorElm.addEventListener('change', () => {
			topPlayerColorElm.value = bottomPlayerColorElm.value === 'white' ? 'black' : 'white';
		});
		bottomPlayerTypeElm.addEventListener('change', () => {
			bottomPlayerNameElm.value = bottomPlayerTypeElm.value === 'bot' ? 'Bottom Bot' : 'Bottom Player';
		});
		startButtonElm.addEventListener('click', () => {
			if (bottomPlayerColorElm.value === 'white') {
				onWelcomeDone(
					bottomPlayerTypeElm.value === 'bot' ? PlayerType.BOT : PlayerType.HUMAN,
					bottomPlayerTypeElm.value === 'bot' ? PlayerGenderType.NA : bottomPlayerTypeElm.value === 'male' ? PlayerGenderType.MALE : PlayerGenderType.FEMALE,
					bottomPlayerNameElm.value.trim() || 'Bottom Player',
					topPlayerTypeElm.value === 'bot' ? PlayerType.BOT : PlayerType.HUMAN,
					topPlayerTypeElm.value === 'bot' ? PlayerGenderType.NA : topPlayerTypeElm.value === 'male' ? PlayerGenderType.MALE : PlayerGenderType.FEMALE,
					topPlayerNameElm.value.trim() || 'Top Player',
					fenTextElm.value.trim() || Fen.default,
					pieceDesignElm.value as UiPieceDesign,
					false,
				);
			} else {
				onWelcomeDone(
					topPlayerTypeElm.value === 'bot' ? PlayerType.BOT : PlayerType.HUMAN,
					topPlayerTypeElm.value === 'bot' ? PlayerGenderType.NA : topPlayerTypeElm.value === 'male' ? PlayerGenderType.MALE : PlayerGenderType.FEMALE,
					topPlayerNameElm.value.trim() || 'Top Player',
					bottomPlayerTypeElm.value === 'bot' ? PlayerType.BOT : PlayerType.HUMAN,
					bottomPlayerTypeElm.value === 'bot' ? PlayerGenderType.NA : bottomPlayerTypeElm.value === 'male' ? PlayerGenderType.MALE : PlayerGenderType.FEMALE,
					bottomPlayerNameElm.value.trim() || 'Bottom Player',
					fenTextElm.value.trim() || Fen.default,
					pieceDesignElm.value as UiPieceDesign,
					true,
				);
			}
		});
	}
}
