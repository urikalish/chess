import {UIHelper} from "./ui-helper.js";
import {Fen} from "./fen.js";

export class Welcome {

	static init(onWelcomeDone) {
		UIHelper.getElm('welcome-fen-text').value = Fen.default;
		const playerWhiteElm = UIHelper.getElm('welcome-player-color-selector-white');
		const playerBlackElm = UIHelper.getElm('welcome-player-color-selector-black');
		playerWhiteElm.addEventListener('click', () => {
			playerWhiteElm.classList.add('selected');
			playerBlackElm.classList.remove('selected');
		});
		playerBlackElm.addEventListener('click', () => {
			playerBlackElm.classList.add('selected');
			playerWhiteElm.classList.remove('selected');
		});
		UIHelper.getElm('welcome-start-button').addEventListener('click', () => {
			const fenStr = UIHelper.getElm('welcome-fen-text').value || Fen.default;
			const playerName = UIHelper.getElm('welcome-player-name-text').value || 'Player1';
			const isWhite = UIHelper.getElm('welcome-player-color-selector-white').classList.contains('selected');
			onWelcomeDone(fenStr, playerName, isWhite);
		});
	}
}