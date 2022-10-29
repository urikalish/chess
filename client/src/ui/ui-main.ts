import { PlayerType } from '../types.js';
import { Fen } from '../fen.js';
import { Piece } from '../piece';
import { Game } from '../game.js';
import { UiHelper } from './ui-helper.js';
import { UIInit } from './ui-init.js';

export class UiMain {
	static game: Game;
	static isBoardFlipped = false;
	static selectedSquareIndex = -1;

	static goMove(srcSquareIndex: number, dstSquareIndex: number) {
		const move = UiMain.game.move(srcSquareIndex, dstSquareIndex);
		if (!move.isLegal) {
			return;
		}
		if (move.removedPiece) {
			UiMain.removePieceElm(move.removedPiece);
		}
	}

	static handleSelection(newSquareIndex: number) {
		const curSquareIndex = UiMain.selectedSquareIndex;
		if (curSquareIndex === -1) {
			UiMain.selectedSquareIndex = newSquareIndex;
		} else if (curSquareIndex === newSquareIndex) {
			UiMain.selectedSquareIndex = -1;
		} else {
			UiMain.selectedSquareIndex = -1;
			UiMain.goMove(curSquareIndex, newSquareIndex);
		}
		UiMain.updateUI();
	}

	static handleClickSquareElm(event: MouseEvent) {
		if (!event.target) {
			return;
		}
		const elm = event.target as HTMLDivElement;
		UiMain.handleSelection(elm ? Number(elm.dataset.index) : -1);
	}

	static handleClickPieceElm(event: MouseEvent) {
		if (!event.target) {
			return;
		}
		const piece = UiMain.game.getPiece((event.target as HTMLDivElement)?.dataset?.name || '');
		const selectedSquareIndex = piece ? piece.square?.index ?? -1 : -1;
		UiMain.handleSelection(selectedSquareIndex);
	}

	static removePieceElm(piece: Piece) {
		const elm = UiHelper.queryNameElm(piece.name);
		if (elm) {
			elm.remove();
		}
	}

	static createGameUI(game: Game) {
		UiMain.game = game;
		UiMain.isBoardFlipped = game.players[0].type === PlayerType.COMPUTER && game.players[1].type === PlayerType.HUMAN;
		UIInit.createGameUI(game.players, game.board, UiMain.isBoardFlipped, UiMain.handleClickSquareElm, UiMain.handleClickPieceElm);
	}

	static updateBoardUI(board) {
		for (let index = 0; index < 64; index++) {
			const modifiedIndex = UiMain.isBoardFlipped ? 63 - index : index;
			const squareElm = UiHelper.queryIndexElm(index);
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
			if (index === UiMain.selectedSquareIndex) {
				squareElm.classList.add('selected-square');
			}
			const pieceElm = UiHelper.queryNameElm(piece.name);
			if (!pieceElm) {
				return;
			}
			pieceElm.style.transform = `translate(${index % 8}00%, ${Math.trunc(index / 8)}00%)`;
		}
	}

	static updateFenUI() {
		const infoFenElm = UiHelper.getElm('info-fen');
		if (infoFenElm) {
			infoFenElm.innerText = Fen.getFenStr(UiMain.game.getCurPosition());
		}
	}

	static updateUI() {
		UiMain.updateBoardUI(UiMain.game.board);
		UiMain.updateFenUI();
	}
}
