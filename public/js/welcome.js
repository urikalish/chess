import {UIHelper} from "./ui-helper.js";
import {Fen} from "./fen.js";

export class Welcome {

	static init(onWelcomeDone) {
		UIHelper.getElm('fen-text').value = Fen.default;
		const playerWhiteElm = UIHelper.getElm('player-color-selector-white');
		const playerBlackElm = UIHelper.getElm('player-color-selector-black');
		playerWhiteElm.addEventListener('click', () => {
			playerWhiteElm.classList.add('selected');
			playerBlackElm.classList.remove('selected');
		});
		playerBlackElm.addEventListener('click', () => {
			playerBlackElm.classList.add('selected');
			playerWhiteElm.classList.remove('selected');
		});
		UIHelper.getElm('start-button').addEventListener('click', () => {
			const fenStr = UIHelper.getElm('fen-text').value || Fen.default;
			const isWhite = UIHelper.getElm('player-color-selector-white').classList.contains('selected');
			onWelcomeDone(fenStr, isWhite);
		});
	}
}