import { Fen } from '../model/fen';
import { PlayerGenderType, PlayerType } from '../model/player';
import { UiHelper } from './ui-helper';
import { UiPieceDesign } from './ui-design';

export class UiWelcome {
	static topPlayerColorElm = UiHelper.getElm('welcome-top-player-color') as HTMLSelectElement;
	static topPlayerTypeElm = UiHelper.getElm('welcome-top-player-type') as HTMLSelectElement;
	static topPlayerNameElm = UiHelper.getElm('welcome-top-player-name') as HTMLInputElement;
	static bottomPlayerColorElm = UiHelper.getElm('welcome-bottom-player-color') as HTMLSelectElement;
	static bottomPlayerTypeElm = UiHelper.getElm('welcome-bottom-player-type') as HTMLSelectElement;
	static bottomPlayerNameElm = UiHelper.getElm('welcome-bottom-player-name') as HTMLInputElement;
	static fenTextElm = UiHelper.getElm('welcome-fen-text') as HTMLInputElement;
	static pieceDesignElm = UiHelper.getElm('welcome-piece-design') as HTMLSelectElement;
	static resetButtonElm = UiHelper.getElm('welcome-reset-button') as HTMLButtonElement;
	static startButtonElm = UiHelper.getElm('welcome-start-button') as HTMLButtonElement;

	static setDefaultValues() {
		UiWelcome.topPlayerColorElm.value = 'black';
		UiWelcome.topPlayerTypeElm.value = 'female';
		UiWelcome.topPlayerNameElm.value = 'Top Player';
		UiWelcome.bottomPlayerColorElm.value = 'white';
		UiWelcome.bottomPlayerTypeElm.value = 'male';
		UiWelcome.bottomPlayerNameElm.value = 'Bottom Player';
		UiWelcome.fenTextElm.value = Fen.default;
		UiWelcome.pieceDesignElm.value = 'neo-wood';
	}

	static showDialog(onWelcomeDone, loadFromStorage = true) {
		UiWelcome.topPlayerColorElm.addEventListener('change', () => {
			UiWelcome.bottomPlayerColorElm.value = UiWelcome.topPlayerColorElm.value === 'white' ? 'black' : 'white';
		});
		UiWelcome.topPlayerTypeElm.addEventListener('change', () => {
			UiWelcome.topPlayerNameElm.value = UiWelcome.topPlayerTypeElm.value === 'bot' ? 'Top Bot' : 'Top Player';
		});
		UiWelcome.bottomPlayerColorElm.addEventListener('change', () => {
			UiWelcome.topPlayerColorElm.value = UiWelcome.bottomPlayerColorElm.value === 'white' ? 'black' : 'white';
		});
		UiWelcome.bottomPlayerTypeElm.addEventListener('change', () => {
			UiWelcome.bottomPlayerNameElm.value = UiWelcome.bottomPlayerTypeElm.value === 'bot' ? 'Bottom Bot' : 'Bottom Player';
		});
		UiWelcome.startButtonElm.addEventListener('click', () => {
			UiWelcome.saveToLocalStorage(
				UiWelcome.topPlayerColorElm,
				UiWelcome.topPlayerTypeElm,
				UiWelcome.topPlayerNameElm,
				UiWelcome.bottomPlayerColorElm,
				UiWelcome.bottomPlayerTypeElm,
				UiWelcome.bottomPlayerNameElm,
				UiWelcome.fenTextElm,
				UiWelcome.pieceDesignElm,
			);
			if (UiWelcome.bottomPlayerColorElm.value === 'white') {
				onWelcomeDone(
					UiWelcome.bottomPlayerTypeElm.value === 'bot' ? PlayerType.BOT : PlayerType.HUMAN,
					UiWelcome.bottomPlayerTypeElm.value === 'bot'
						? PlayerGenderType.NA
						: UiWelcome.bottomPlayerTypeElm.value === 'male'
						? PlayerGenderType.MALE
						: PlayerGenderType.FEMALE,
					UiWelcome.bottomPlayerNameElm.value.trim() || 'Bottom Player',
					UiWelcome.topPlayerTypeElm.value === 'bot' ? PlayerType.BOT : PlayerType.HUMAN,
					UiWelcome.topPlayerTypeElm.value === 'bot'
						? PlayerGenderType.NA
						: UiWelcome.topPlayerTypeElm.value === 'male'
						? PlayerGenderType.MALE
						: PlayerGenderType.FEMALE,
					UiWelcome.topPlayerNameElm.value.trim() || 'Top Player',
					UiWelcome.fenTextElm.value.trim() || Fen.default,
					UiWelcome.pieceDesignElm.value as UiPieceDesign,
					false,
				);
			} else {
				onWelcomeDone(
					UiWelcome.topPlayerTypeElm.value === 'bot' ? PlayerType.BOT : PlayerType.HUMAN,
					UiWelcome.topPlayerTypeElm.value === 'bot'
						? PlayerGenderType.NA
						: UiWelcome.topPlayerTypeElm.value === 'male'
						? PlayerGenderType.MALE
						: PlayerGenderType.FEMALE,
					UiWelcome.topPlayerNameElm.value.trim() || 'Top Player',
					UiWelcome.bottomPlayerTypeElm.value === 'bot' ? PlayerType.BOT : PlayerType.HUMAN,
					UiWelcome.bottomPlayerTypeElm.value === 'bot'
						? PlayerGenderType.NA
						: UiWelcome.bottomPlayerTypeElm.value === 'male'
						? PlayerGenderType.MALE
						: PlayerGenderType.FEMALE,
					UiWelcome.bottomPlayerNameElm.value.trim() || 'Bottom Player',
					UiWelcome.fenTextElm.value.trim() || Fen.default,
					UiWelcome.pieceDesignElm.value as UiPieceDesign,
					true,
				);
			}
		});
		UiWelcome.resetButtonElm.addEventListener('click', () => {
			UiWelcome.setDefaultValues();
		});

		if (loadFromStorage) {
			UiWelcome.loadFromLocalStorage(
				UiWelcome.topPlayerColorElm,
				UiWelcome.topPlayerTypeElm,
				UiWelcome.topPlayerNameElm,
				UiWelcome.bottomPlayerColorElm,
				UiWelcome.bottomPlayerTypeElm,
				UiWelcome.bottomPlayerNameElm,
				UiWelcome.fenTextElm,
				UiWelcome.pieceDesignElm,
			);
		}
	}

	static loadFromLocalStorage(...elms) {
		elms.forEach(elm => {
			const value = localStorage.getItem(elm.id);
			if (value) {
				elm.value = value.trim();
			}
		});
	}

	static saveToLocalStorage(...elms) {
		elms.forEach(elm => {
			localStorage.setItem(elm.id, elm.value.trim());
		});
	}
}
