import {Board} from "./board.js";
import {Settings} from "./settings.js";

export class UIHelper {

	static getElm(id) {
		return document.getElementById(id);
	}

	static createBoardMarkings() {
		const gutterElms = document.querySelectorAll('.board-gutter');
		for (let g = 0; g < 4; g++) {
			for (let index = 0; index < 8; index++) {
				const modifiedIndex = g % 2 === 0
				? (Settings.isFlippedBoard ? 7 - index : index)
				: (Settings.isFlippedBoard ? index + 1 : 8 - index);
				const markElm = document.createElement('div');
				markElm.classList.add('board-gutter-label');
				markElm.innerText = g % 2 === 0
				? String.fromCharCode(97 + modifiedIndex)
				: String(modifiedIndex);
				gutterElms[g].appendChild(markElm);
			}
		}
	}

	static createBoardSquares() {
		const boardElm = UIHelper.getElm('board-squares');
		for (let index = 0; index < 64; index++) {
			const modifiedIndex = Settings.isFlippedBoard ? 63 - index : index;
			const squareName = Board.getSquareNameByIndex(modifiedIndex);
			const squareElm = document.createElement('div');
			squareElm.setAttribute('data-index', String(index));
			squareElm.setAttribute('data-name', squareName);
			squareElm.classList.add('square', 'empty');
			boardElm.appendChild(squareElm);
		}
	}

	static createGameUI() {
		UIHelper.createBoardMarkings();
		UIHelper.createBoardSquares();
		UIHelper.getElm('board-frame').classList.remove('none');
		UIHelper.getElm('welcome-panel').classList.add('none');
	}

	static placePieces(board) {
		for (let i = 0; i < 64; i++) {
			const squareElm = document.querySelector(`.square[data-index="${i}"]`);
			squareElm.className = '';
			const modifiedIndex = Settings.isFlippedBoard ? 63 - i : i;
			const char = board.boardPieces[modifiedIndex];
			if (!char) {
				squareElm.classList.add('square', 'empty');
				continue;
			}
			squareElm.classList.add('square', 'occupied', char === char.toLowerCase() ? 'black' : 'white', 'piece', char);
		}
	}

}
