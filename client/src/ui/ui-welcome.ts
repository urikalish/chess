import { Fen } from '../model/fen';
import { PlayerGenderType, PlayerType } from '../model/player';
import { UiHelper } from './ui-helper';
import { UiPieceDesign } from './ui-design';

export class UiWelcome {
	topPlayerColorElm: HTMLSelectElement = UiHelper.getElm('welcome-top-player-color') as HTMLSelectElement;
	topPlayerTypeElm: HTMLSelectElement = UiHelper.getElm('welcome-top-player-type') as HTMLSelectElement;
	topPlayerNameElm: HTMLInputElement = UiHelper.getElm('welcome-top-player-name') as HTMLInputElement;
	topBotNameElm: HTMLSelectElement = UiHelper.getElm('welcome-top-bot-name') as HTMLSelectElement;
	bottomPlayerColorElm: HTMLSelectElement = UiHelper.getElm('welcome-bottom-player-color') as HTMLSelectElement;
	bottomPlayerTypeElm: HTMLSelectElement = UiHelper.getElm('welcome-bottom-player-type') as HTMLSelectElement;
	bottomPlayerNameElm: HTMLInputElement = UiHelper.getElm('welcome-bottom-player-name') as HTMLInputElement;
	bottomBotNameElm: HTMLSelectElement = UiHelper.getElm('welcome-bottom-bot-name') as HTMLSelectElement;
	fenTextElm: HTMLInputElement = UiHelper.getElm('welcome-fen-text') as HTMLInputElement;
	pieceDesignElm: HTMLSelectElement = UiHelper.getElm('welcome-piece-design') as HTMLSelectElement;
	resetButtonElm: HTMLButtonElement = UiHelper.getElm('welcome-reset-button') as HTMLButtonElement;
	startButtonElm: HTMLButtonElement = UiHelper.getElm('welcome-start-button') as HTMLButtonElement;

	dataLineTopPlayerName: HTMLDivElement = UiHelper.getElm('welcome-data-line-top-player-name') as HTMLDivElement;
	dataLineTopBotName: HTMLDivElement = UiHelper.getElm('welcome-data-line-top-bot-name') as HTMLDivElement;
	dataLineBottomPlayerName: HTMLDivElement = UiHelper.getElm('welcome-data-line-bottom-player-name') as HTMLDivElement;
	dataLineBottomBotName: HTMLDivElement = UiHelper.getElm('welcome-data-line-bottom-bot-name') as HTMLDivElement;

	showOrHideElms() {
		this.dataLineTopPlayerName.classList.toggle('none', this.topPlayerTypeElm.value === 'bot');
		this.dataLineTopBotName.classList.toggle('none', this.topPlayerTypeElm.value !== 'bot');
		this.dataLineBottomPlayerName.classList.toggle('none', this.bottomPlayerTypeElm.value === 'bot');
		this.dataLineBottomBotName.classList.toggle('none', this.bottomPlayerTypeElm.value !== 'bot');
	}

	setDefaultValues() {
		this.topPlayerColorElm.value = 'black';
		this.topPlayerTypeElm.value = 'bot';
		this.topPlayerNameElm.value = 'bot0';
		this.topBotNameElm.value = 'bot0';
		this.bottomPlayerColorElm.value = 'white';
		this.bottomPlayerTypeElm.value = 'male';
		this.bottomPlayerNameElm.value = UiHelper.getRandomName(true);
		this.bottomBotNameElm.value = 'bot0';
		this.fenTextElm.value = Fen.default;
		this.pieceDesignElm.value = 'neo-wood';
		this.showOrHideElms();
	}

	showDialog(onWelcomeDone) {
		this.topPlayerColorElm.addEventListener('change', () => {
			this.bottomPlayerColorElm.value = this.topPlayerColorElm.value === 'white' ? 'black' : 'white';
		});
		this.bottomPlayerColorElm.addEventListener('change', () => {
			this.topPlayerColorElm.value = this.bottomPlayerColorElm.value === 'white' ? 'black' : 'white';
		});
		this.topPlayerTypeElm.addEventListener('change', () => {
			this.topPlayerNameElm.value = this.topPlayerTypeElm.value === 'bot' ? 'bot0' : UiHelper.getRandomName(this.topPlayerTypeElm.value === 'male');
			this.showOrHideElms();
		});
		this.bottomPlayerTypeElm.addEventListener('change', () => {
			this.bottomPlayerNameElm.value = this.bottomPlayerTypeElm.value === 'bot' ? 'bot0' : UiHelper.getRandomName(this.bottomPlayerTypeElm.value === 'male');
			this.showOrHideElms();
		});
		this.startButtonElm.addEventListener('click', () => {
			this.saveToLocalStorage(
				this.topPlayerColorElm,
				this.topPlayerTypeElm,
				this.topPlayerNameElm,
				this.topBotNameElm,
				this.bottomPlayerColorElm,
				this.bottomPlayerTypeElm,
				this.bottomPlayerNameElm,
				this.bottomBotNameElm,
				this.fenTextElm,
				this.pieceDesignElm,
			);
			if (this.bottomPlayerColorElm.value === 'white') {
				onWelcomeDone(
					this.bottomPlayerTypeElm.value === 'bot' ? PlayerType.BOT : PlayerType.HUMAN,
					this.bottomPlayerTypeElm.value === 'bot' ? PlayerGenderType.NA : this.bottomPlayerTypeElm.value === 'male' ? PlayerGenderType.MALE : PlayerGenderType.FEMALE,
					this.bottomPlayerTypeElm.value === 'bot' ? this.bottomBotNameElm.value : this.bottomPlayerNameElm.value.trim() || 'Bottom Player',
					this.topPlayerTypeElm.value === 'bot' ? PlayerType.BOT : PlayerType.HUMAN,
					this.topPlayerTypeElm.value === 'bot' ? PlayerGenderType.NA : this.topPlayerTypeElm.value === 'male' ? PlayerGenderType.MALE : PlayerGenderType.FEMALE,
					this.topPlayerTypeElm.value === 'bot' ? this.topBotNameElm.value : this.topPlayerNameElm.value.trim() || 'Top Player',
					this.fenTextElm.value.trim() || Fen.default,
					this.pieceDesignElm.value as UiPieceDesign,
					false,
					false,
				);
			} else {
				onWelcomeDone(
					this.topPlayerTypeElm.value === 'bot' ? PlayerType.BOT : PlayerType.HUMAN,
					this.topPlayerTypeElm.value === 'bot' ? PlayerGenderType.NA : this.topPlayerTypeElm.value === 'male' ? PlayerGenderType.MALE : PlayerGenderType.FEMALE,
					this.topPlayerTypeElm.value === 'bot' ? this.topBotNameElm.value : this.topPlayerNameElm.value.trim() || 'Top Player',
					this.bottomPlayerTypeElm.value === 'bot' ? PlayerType.BOT : PlayerType.HUMAN,
					this.bottomPlayerTypeElm.value === 'bot' ? PlayerGenderType.NA : this.bottomPlayerTypeElm.value === 'male' ? PlayerGenderType.MALE : PlayerGenderType.FEMALE,
					this.bottomPlayerTypeElm.value === 'bot' ? this.bottomBotNameElm.value : this.bottomPlayerNameElm.value.trim() || 'Bottom Player',
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
			this.topBotNameElm,
			this.bottomPlayerColorElm,
			this.bottomPlayerTypeElm,
			this.bottomPlayerNameElm,
			this.bottomBotNameElm,
			this.fenTextElm,
			this.pieceDesignElm,
		);
		this.showOrHideElms();
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
