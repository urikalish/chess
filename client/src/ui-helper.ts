import { PlayerType } from './types.js';
import { Square } from './square.js';
import { Player } from './player.js';
import { Game } from './game.js';

export class UIHelper {
	static isBoardFlipped = false;

	static getElm(id) {
		return document.getElementById(id);
	}

	static queryElm(selectors) {
		return document.querySelector(selectors);
	}

	static queryElms(selectors) {
		return document.querySelectorAll(selectors);
	}

	static updatePlayersInfo(players: Player[]) {
		const colorElms = UIHelper.queryElms('.info-player-color');
		colorElms[0].style.backgroundColor = UIHelper.isBoardFlipped ? '#fff' : '#000';
		colorElms[1].style.backgroundColor = UIHelper.isBoardFlipped ? '#000' : '#fff';
		const nameElms = UIHelper.queryElms('.info-player-name');
		nameElms[0].innerText = UIHelper.isBoardFlipped ? players[0].name : players[1].name;
		nameElms[1].innerText = UIHelper.isBoardFlipped ? players[1].name : players[0].name;
	}

	static createBoardMarkings() {
		const gutterElms = UIHelper.queryElms('.board-gutter');
		for (let g = 0; g < 4; g++) {
			for (let index = 0; index < 8; index++) {
				const modifiedIndex = g % 2 === 0 ? (UIHelper.isBoardFlipped ? 7 - index : index) : UIHelper.isBoardFlipped ? index + 1 : 8 - index;
				const markElm = document.createElement('div');
				markElm.classList.add('board-gutter-label');
				markElm.innerText = g % 2 === 0 ? String.fromCharCode(97 + modifiedIndex) : String(modifiedIndex);
				gutterElms[g].appendChild(markElm);
			}
		}
	}

	static createBoardSquares() {
		const boardSquaresElm = UIHelper.getElm('board-squares');
		if (!boardSquaresElm) {
			return;
		}
		for (let index = 0; index < 64; index++) {
			const modifiedIndex = UIHelper.isBoardFlipped ? 63 - index : index;
			const squareName = Square.getSquareNameByIndex(modifiedIndex);
			const squareElm = document.createElement('div');
			squareElm.setAttribute('data-index', String(index));
			squareElm.setAttribute('data-name', squareName);
			squareElm.classList.add('square', 'empty');
			boardSquaresElm.appendChild(squareElm);
		}
	}

	static createGameUI(game: Game) {
		UIHelper.isBoardFlipped = game.players[0].type === PlayerType.COMPUTER && game.players[1].type === PlayerType.HUMAN;
		UIHelper.createBoardMarkings();
		UIHelper.createBoardSquares();
		UIHelper.updatePlayersInfo(game.players);
		const mainContentElm = UIHelper.getElm('main-content');
		const welcomePanelElm = UIHelper.getElm('welcome-panel');
		if (!mainContentElm || !welcomePanelElm) {
			return;
		}
		mainContentElm.classList.remove('none');
		welcomePanelElm.classList.add('none');
	}

	static placePieces(board) {
		for (let index = 0; index < 64; index++) {
			const modifiedIndex = UIHelper.isBoardFlipped ? 63 - index : index;
			const squareElm = UIHelper.queryElm(`.square[data-index="${index}"]`);
			if (!squareElm) {
				return;
			}
			squareElm.className = '';
			const square = board.squares[modifiedIndex];
			if (square.isEmpty()) {
				squareElm.classList.add('square', 'empty');
				continue;
			}
			const piece = square.piece;
			squareElm.classList.add('square', 'occupied', piece.armyIndex === 0 ? 'white' : 'black', 'piece', piece.typeCased);
		}
	}
}
