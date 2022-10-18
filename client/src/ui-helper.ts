import { PlayerType, UserMsgType } from './types.js';
import { Square } from './square.js';
import { Board } from './board.js';
import { Piece } from './piece';
import { Player } from './player.js';
import { Game } from './game.js';
import { Helper } from './helper.js';

export class UIHelper {
	static isBoardFlipped = false;
	static startTime = 0;
	static pieceElms: HTMLElement[] = [];

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

	static logUserMessage(msg: string, type: UserMsgType) {
		const panelElm = UIHelper.getElm('info-log');
		if (!panelElm) {
			return;
		}
		const msgElm = document.createElement('div');
		msgElm.classList.add('info-log-msg', String(type));
		msgElm.innerText = `${Helper.getTimeStr(new Date().getTime() - UIHelper.startTime)} - ${msg}`;
		msgElm.setAttribute('title', msg);
		panelElm.appendChild(msgElm);
		panelElm.scrollTo(0, panelElm.scrollHeight);
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
			squareElm.setAttribute('id', String(index));
			squareElm.setAttribute('data-name', squareName);
			squareElm.classList.add('square', 'empty');
			boardSquaresElm.appendChild(squareElm);
		}
	}

	static createPieceElm(piece: Piece) {
		const boardPiecesElm = document.getElementById('board-pieces');
		if (!boardPiecesElm) {
			return;
		}
		const pieceElm = document.createElement('div');
		pieceElm.setAttribute('data-name', piece.name);
		pieceElm.classList.add('piece', piece.typeCased);
		boardPiecesElm.appendChild(pieceElm);
		UIHelper.pieceElms.push(pieceElm);
		return pieceElm;
	}

	static createPieceElms(board: Board) {
		const boardSquaresElm = UIHelper.getElm('board-squares');
		if (!boardSquaresElm) {
			return;
		}
		for (let index = 0; index < 64; index++) {
			const modifiedIndex = UIHelper.isBoardFlipped ? 63 - index : index;
			const square = board.squares[modifiedIndex];
			if (!square.piece) {
				continue;
			}
			UIHelper.createPieceElm(square.piece);
		}
	}

	static createGameUI(game: Game) {
		UIHelper.isBoardFlipped = game.players[0].type === PlayerType.COMPUTER && game.players[1].type === PlayerType.HUMAN;
		UIHelper.updatePlayersInfo(game.players);
		UIHelper.createBoardMarkings();
		UIHelper.createBoardSquares();
		UIHelper.createPieceElms(game.board);
		const pageBgImageElm = UIHelper.getElm('page-bg-img');
		const mainContentElm = UIHelper.getElm('main-content');
		const welcomePanelElm = UIHelper.getElm('welcome-panel');
		if (!pageBgImageElm || !mainContentElm || !welcomePanelElm) {
			return;
		}
		pageBgImageElm.classList.add('game-on');
		mainContentElm.classList.remove('none');
		welcomePanelElm.classList.add('none');
	}

	static placePieces(board) {
		for (let index = 0; index < 64; index++) {
			const modifiedIndex = UIHelper.isBoardFlipped ? 63 - index : index;
			const squareElm = UIHelper.getElm(index);
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
			squareElm.classList.add('square', 'occupied', piece.armyIndex === 0 ? 'white' : 'black', piece.typeCased);
			const pieceElm = UIHelper.pieceElms.find(pe => pe.getAttribute('data-name') === piece.name);
			if (!pieceElm) {
				return;
			}
			pieceElm.style.transform = `translate(${index % 8}00%, ${Math.trunc(index / 8)}00%)`;
		}
	}
}
