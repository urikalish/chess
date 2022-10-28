import { PlayerType } from './types.js';
import { Piece } from './piece';
import { Game } from './game.js';
import { UIInit } from './ui-init.js';

export class UIHelper {
	static game: Game;
	static isBoardFlipped = false;
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

	static removeOnePieceElm(piece: Piece) {
		const elm = UIHelper.queryElm(`[data-name="${piece.name}"]`);
		if (elm) {
			elm.remove();
		}
	}

	static createGameUI(game: Game) {
		UIHelper.isBoardFlipped = game.players[0].type === PlayerType.COMPUTER && game.players[1].type === PlayerType.HUMAN;
		UIInit.createGameUI(game.players, game.board, UIHelper.isBoardFlipped, UIHelper.handleClickSquare, UIHelper.handleClickPiece);
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
			const pieceElm = UIHelper.queryElm(`[data-name="${piece.name}"]`);
			if (!pieceElm) {
				return;
			}
			pieceElm.style.transform = `translate(${index % 8}00%, ${Math.trunc(index / 8)}00%)`;
		}
	}
}
