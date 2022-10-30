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

	static goMove(from: number, to: number) {
		const move = UiMain.game.move(from, to);
		if (!move) {
			return;
		}
		if (move.capturedPiece) {
			UiMain.removePieceElm(move.capturedPiece);
		}
	}

	static handleUiSelection(newSquareIndex: number) {
		const curSquareIndex = UiMain.selectedSquareIndex;
		if (UiMain.selectedSquareIndex === -1) {
			if (UiMain.game.board.squares[newSquareIndex].isOccupied()) {
				UiMain.selectedSquareIndex = newSquareIndex;
			}
		} else if (UiMain.selectedSquareIndex === newSquareIndex) {
			UiMain.selectedSquareIndex = -1;
		} else {
			UiMain.goMove(curSquareIndex, newSquareIndex);
			UiMain.selectedSquareIndex = -1;
		}
		UiMain.updateUI();
	}

	static handleClickSquareElm(event: MouseEvent) {
		if (!event.target) {
			return;
		}
		const elm = event.target as HTMLDivElement;
		if (elm) {
			UiMain.handleUiSelection(Number(elm.dataset.index));
		} else {
			UiMain.handleUiSelection(-1);
		}
	}

	static handleClickPieceElm(event: MouseEvent) {
		if (!event.target) {
			return;
		}
		const elm = event.target as HTMLDivElement;
		if (elm) {
			UiMain.handleUiSelection(Number(elm.dataset.squareIndex));
		} else {
			UiMain.handleUiSelection(-1);
		}
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

	static updateBoardUI() {
		for (let uiIndex = 0; uiIndex < 64; uiIndex++) {
			const squareElm = UiHelper.queryUiIndexElm(uiIndex);
			if (!squareElm) {
				return;
			}
			const index = UiHelper.getModifiedIndex(uiIndex, UiMain.isBoardFlipped);
			const lastMove = UiMain.game.getLastMove();
			squareElm.className = '';
			const square = UiMain.game.board.squares[index];
			if (square.isEmpty()) {
				squareElm.classList.add('square', 'empty');
				if (lastMove && lastMove.from === index) {
					squareElm.classList.add('last-move-src');
				}
				continue;
			}
			const piece = square.piece;
			if (!piece) {
				continue;
			}
			squareElm.classList.add('square', 'occupied', piece.armyIndex === 0 ? 'white' : 'black', piece.typeCased);
			if (lastMove && lastMove.to === index) {
				squareElm.classList.add('last-move-dst');
			}
			if (index === UiMain.selectedSquareIndex) {
				squareElm.classList.add('selected-square');
			}
			const pieceElm = UiHelper.queryNameElm(piece.name);
			if (!pieceElm) {
				return;
			}
			pieceElm.dataset.squareIndex = String(index);
			pieceElm.style.transform = `translate(${uiIndex % 8}00%, ${Math.trunc(uiIndex / 8)}00%)`;
		}
	}

	static updateFenUI() {
		const infoFenElm = UiHelper.getElm('info-fen');
		if (infoFenElm) {
			infoFenElm.innerText = Fen.getFenStr(UiMain.game.getLastPosition());
		}
	}

	static updateUI() {
		UiMain.updateBoardUI();
		UiMain.updateFenUI();
	}
}
