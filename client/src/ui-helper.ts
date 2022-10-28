import { PlayerType, UserMsgType } from './types.js';
import { Player } from './player.js';
import { Piece } from './piece';
import { Square } from './square.js';
import { Board } from './board.js';
import { Game } from './game.js';
import { Helper } from './helper.js';

export class UIHelper {
	static game: Game;
	static isBoardFlipped = false;
	static squareElms: HTMLDivElement[] = [];
	static pieceElms: HTMLElement[] = [];
	static selectedSquareIndex = -1;

	static getElm(id) {
		return document.getElementById(id);
	}

	static queryElm(selectors) {
		return document.querySelector(selectors);
	}

	static queryElms(selectors) {
		return document.querySelectorAll(selectors);
	}

	static logUserMessage(msg: string, type: UserMsgType) {
		const panelElm = UIHelper.getElm('info-log');
		if (!panelElm) {
			return;
		}
		const msgElm = document.createElement('div');
		msgElm.classList.add('info-log-msg', String(type));
		msgElm.innerText = `${Helper.getTimeStr(new Date().getTime() - UIHelper.game.startTime)} - ${msg}`;
		msgElm.setAttribute('title', msg);
		panelElm.appendChild(msgElm);
		panelElm.scrollTo(0, panelElm.scrollHeight);
	}

	static createPlayersInfoUI(players: Player[]) {
		const colorElms = UIHelper.queryElms('.info-player-color');
		colorElms[0].style.backgroundColor = UIHelper.isBoardFlipped ? '#fff' : '#000';
		colorElms[1].style.backgroundColor = UIHelper.isBoardFlipped ? '#000' : '#fff';
		const nameElms = UIHelper.queryElms('.info-player-name');
		nameElms[0].innerText = UIHelper.isBoardFlipped ? players[0].name : players[1].name;
		nameElms[1].innerText = UIHelper.isBoardFlipped ? players[1].name : players[0].name;
	}

	static createBoardGuttersUI() {
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

	static goMove(srcSquareIndex: number, dstSquareIndex: number) {
		const move = UIHelper.game.move(srcSquareIndex, dstSquareIndex);
		if (move.isLegal && move.removedPiece) {
			UIHelper.removeOnePieceElm(move.removedPiece);
		}
	}

	static handleSelection(newSquareIndex: number) {
		const curSquareIndex = UIHelper.selectedSquareIndex;
		if (curSquareIndex === -1) {
			UIHelper.selectedSquareIndex = newSquareIndex;
		} else if (curSquareIndex === newSquareIndex) {
			UIHelper.selectedSquareIndex = -1;
		} else {
			UIHelper.selectedSquareIndex = -1;
			UIHelper.goMove(curSquareIndex, newSquareIndex);
		}
		UIHelper.updateBoard(UIHelper.game.board);
	}

	static handleClickSquare(event: MouseEvent) {
		if (!event.target) {
			return;
		}
		const elm = event.target as HTMLDivElement;
		UIHelper.handleSelection(elm ? Number(elm.dataset.index) : -1);
	}

	static handleClickPiece(event: MouseEvent) {
		if (!event.target) {
			return;
		}
		const piece = UIHelper.game.getPiece((event.target as HTMLDivElement).dataset.name);
		const selectedSquareIndex = piece ? piece.square?.index ?? -1 : -1;
		UIHelper.handleSelection(selectedSquareIndex);
	}

	static createBoardSquaresUI() {
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
			squareElm.addEventListener('click', UIHelper.handleClickSquare);
			boardSquaresElm.appendChild(squareElm);
			UIHelper.squareElms.push(squareElm);
		}
	}

	static createOnePieceElm(piece: Piece) {
		const boardPiecesElm = document.getElementById('board-pieces');
		if (!boardPiecesElm) {
			return;
		}
		const pieceElm = document.createElement('div');
		pieceElm.setAttribute('data-name', piece.name);
		pieceElm.classList.add('piece', piece.typeCased);
		pieceElm.addEventListener('click', UIHelper.handleClickPiece);
		boardPiecesElm.appendChild(pieceElm);
		UIHelper.pieceElms.push(pieceElm);
		return pieceElm;
	}

	static removeOnePieceElm(piece: Piece) {
		const index = UIHelper.pieceElms.findIndex(elm => elm.dataset.name === piece?.name);
		if (index) {
			UIHelper.pieceElms.splice(index, 1);
		}
		const elm = UIHelper.queryElm(`[data-name="${piece.name}"]`);
		if (elm) {
			elm.remove();
		}
	}

	static createAllPieceElms(board: Board) {
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
			UIHelper.createOnePieceElm(square.piece);
		}
	}

	static createGameUI(game: Game) {
		UIHelper.isBoardFlipped = game.players[0].type === PlayerType.COMPUTER && game.players[1].type === PlayerType.HUMAN;
		UIHelper.createPlayersInfoUI(game.players);
		UIHelper.createBoardGuttersUI();
		UIHelper.createBoardSquaresUI();
		UIHelper.createAllPieceElms(game.board);
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

	static updateBoard(board) {
		for (let index = 0; index < 64; index++) {
			const modifiedIndex = UIHelper.isBoardFlipped ? 63 - index : index;
			const squareElm = UIHelper.queryElm(`[data-index="${index}"]`);
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
			if (index === UIHelper.selectedSquareIndex) {
				squareElm.classList.add('selected-square');
			}
			const pieceElm = UIHelper.pieceElms.find(pe => pe.dataset.name === piece.name);
			if (!pieceElm) {
				return;
			}
			pieceElm.style.transform = `translate(${index % 8}00%, ${Math.trunc(index / 8)}00%)`;
		}
	}
}
