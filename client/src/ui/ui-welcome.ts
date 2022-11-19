import { Fen } from '../model/fen';
import { PlayerGenderType, PlayerType } from '../model/player';
import { UiHelper } from './ui-helper';
import { UiPieceDesign } from './ui-design';

export class UiWelcome {
	topPlayerColorElm: HTMLSelectElement = UiHelper.getElm('welcome-top-player-color') as HTMLSelectElement;
	topPlayerTypeElm: HTMLSelectElement = UiHelper.getElm('welcome-top-player-type') as HTMLSelectElement;
	topPlayerNameElm: HTMLInputElement = UiHelper.getElm('welcome-top-player-name') as HTMLInputElement;
	bottomPlayerColorElm: HTMLSelectElement = UiHelper.getElm('welcome-bottom-player-color') as HTMLSelectElement;
	bottomPlayerTypeElm: HTMLSelectElement = UiHelper.getElm('welcome-bottom-player-type') as HTMLSelectElement;
	bottomPlayerNameElm: HTMLInputElement = UiHelper.getElm('welcome-bottom-player-name') as HTMLInputElement;
	fenTextElm: HTMLInputElement = UiHelper.getElm('welcome-fen-text') as HTMLInputElement;
	pieceDesignElm: HTMLSelectElement = UiHelper.getElm('welcome-piece-design') as HTMLSelectElement;
	resetButtonElm: HTMLButtonElement = UiHelper.getElm('welcome-reset-button') as HTMLButtonElement;
	startButtonElm: HTMLButtonElement = UiHelper.getElm('welcome-start-button') as HTMLButtonElement;

	enableOrDisablePlayerNameElms() {
		this.topPlayerNameElm.disabled = this.topPlayerTypeElm.value === 'bot';
		this.bottomPlayerNameElm.disabled = this.bottomPlayerTypeElm.value === 'bot';
	}

	setDefaultValues() {
		this.topPlayerColorElm.value = 'black';
		this.topPlayerTypeElm.value = 'female';
		this.topPlayerNameElm.value = UiHelper.getRandomName(false);
		this.bottomPlayerColorElm.value = 'white';
		this.bottomPlayerTypeElm.value = 'male';
		this.bottomPlayerNameElm.value = UiHelper.getRandomName(true);
		this.fenTextElm.value = Fen.default;
		this.pieceDesignElm.value = 'neo-wood';
		this.enableOrDisablePlayerNameElms();
	}

	showDialog(onWelcomeDone) {
		this.topPlayerColorElm.addEventListener('change', () => {
			this.bottomPlayerColorElm.value = this.topPlayerColorElm.value === 'white' ? 'black' : 'white';
		});
		this.topPlayerTypeElm.addEventListener('change', () => {
			this.topPlayerNameElm.value = this.topPlayerTypeElm.value === 'bot' ? 'bot0' : UiHelper.getRandomName(this.topPlayerTypeElm.value === 'male');
			this.enableOrDisablePlayerNameElms();
		});
		this.bottomPlayerColorElm.addEventListener('change', () => {
			this.topPlayerColorElm.value = this.bottomPlayerColorElm.value === 'white' ? 'black' : 'white';
		});
		this.bottomPlayerTypeElm.addEventListener('change', () => {
			this.bottomPlayerNameElm.value = this.bottomPlayerTypeElm.value === 'bot' ? 'bot0' : UiHelper.getRandomName(this.bottomPlayerTypeElm.value === 'male');
			this.enableOrDisablePlayerNameElms();
		});
		this.startButtonElm.addEventListener('click', () => {
			this.saveToLocalStorage(
				this.topPlayerColorElm,
				this.topPlayerTypeElm,
				this.topPlayerNameElm,
				this.bottomPlayerColorElm,
				this.bottomPlayerTypeElm,
				this.bottomPlayerNameElm,
				this.fenTextElm,
				this.pieceDesignElm,
			);
			if (this.bottomPlayerColorElm.value === 'white') {
				onWelcomeDone(
					this.bottomPlayerTypeElm.value === 'bot' ? PlayerType.BOT : PlayerType.HUMAN,
					this.bottomPlayerTypeElm.value === 'bot' ? PlayerGenderType.NA : this.bottomPlayerTypeElm.value === 'male' ? PlayerGenderType.MALE : PlayerGenderType.FEMALE,
					this.bottomPlayerNameElm.value.trim() || 'Bottom Player',
					this.topPlayerTypeElm.value === 'bot' ? PlayerType.BOT : PlayerType.HUMAN,
					this.topPlayerTypeElm.value === 'bot' ? PlayerGenderType.NA : this.topPlayerTypeElm.value === 'male' ? PlayerGenderType.MALE : PlayerGenderType.FEMALE,
					this.topPlayerNameElm.value.trim() || 'Top Player',
					this.fenTextElm.value.trim() || Fen.default,
					this.pieceDesignElm.value as UiPieceDesign,
					false,
					false,
				);
			} else {
				onWelcomeDone(
					this.topPlayerTypeElm.value === 'bot' ? PlayerType.BOT : PlayerType.HUMAN,
					this.topPlayerTypeElm.value === 'bot' ? PlayerGenderType.NA : this.topPlayerTypeElm.value === 'male' ? PlayerGenderType.MALE : PlayerGenderType.FEMALE,
					this.topPlayerNameElm.value.trim() || 'Top Player',
					this.bottomPlayerTypeElm.value === 'bot' ? PlayerType.BOT : PlayerType.HUMAN,
					this.bottomPlayerTypeElm.value === 'bot' ? PlayerGenderType.NA : this.bottomPlayerTypeElm.value === 'male' ? PlayerGenderType.MALE : PlayerGenderType.FEMALE,
					this.bottomPlayerNameElm.value.trim() || 'Bottom Player',
					this.fenTextElm.value.trim() || Fen.default,
					this.pieceDesignElm.value as UiPieceDesign,
					true,
					false,
				);
			}
		});
		this.resetButtonElm.addEventListener('click', () => {
			this.setDefaultValues();
		});

		this.setDefaultValues();
		this.loadFromLocalStorage(
			this.topPlayerColorElm,
			this.topPlayerTypeElm,
			this.topPlayerNameElm,
			this.bottomPlayerColorElm,
			this.bottomPlayerTypeElm,
			this.bottomPlayerNameElm,
			this.fenTextElm,
			this.pieceDesignElm,
		);
		this.enableOrDisablePlayerNameElms();
	}

	loadFromLocalStorage(...elms) {
		elms.forEach(elm => {
			const value = localStorage.getItem(elm.id);
			if (value) {
				elm.value = value.trim();
			}
		});
	}

	saveToLocalStorage(...elms) {
		elms.forEach(elm => {
			localStorage.setItem(elm.id, elm.value.trim());
		});
	}
}
