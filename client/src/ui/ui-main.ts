import { MoveType, PieceType } from '../types';
import { Move } from '../move';
import { Game } from '../game';
import { UiHelper } from './ui-helper';
import { UiLog } from './ui-log';
import { UiPieceDesign } from './ui-types';
import { UiFen } from './ui-fen';
import { UiInit } from './ui-init';
import { UiPromotion } from './ui-promotion';

export class UiMain {
	game: Game;
	isBoardFlipped = false;
	selectedIndex = -1;

	constructor(game: Game, isBoardFlipped: boolean, pieceDesign: UiPieceDesign) {
		this.game = game;
		this.isBoardFlipped = isBoardFlipped;
		const uiInit = new UiInit();
		uiInit.createGameUI(this.game.players, this.game.board, this.isBoardFlipped, pieceDesign, this.handleClickSquareElm.bind(this), this.handleClickPieceElm.bind(this));
		this.selectedIndex = -1;
		this.updateUI();
	}

	startGame() {
		setTimeout(() => {
			this.afterNewPosition();
		}, 1000);
	}

	updateBoardSquaresUI() {
		const squareElms = Array.from(UiHelper.queryElms(`.board-squares > .square`));
		for (let uiIndex = 0; uiIndex < 64; uiIndex++) {
			const index = UiHelper.getModifiedIndex(uiIndex, this.isBoardFlipped);
			const lastMove = this.game.getCurMove();
			const squareElm = squareElms[uiIndex];
			squareElm.className = '';
			const square = this.game.board.squares[index];
			if (square.isEmpty()) {
				squareElm.classList.add('square', 'empty');
				if (lastMove && lastMove.from === index) {
					squareElm.classList.add('last-move-from');
				}
				if (this.selectedIndex !== -1 && this.game.possibleMoves.find(m => m.from === this.selectedIndex && m.to === index)) {
					squareElm.classList.add('possible-to');
					if (this.game.board.squares[this.selectedIndex].piece?.type === PieceType.PAWN && index === this.game.getCurPosition()?.epTargetIndex) {
						squareElm.classList.add('en-passant-target');
					}
				}
				continue;
			}
			const piece = square.piece;
			if (!piece) {
				continue;
			}
			squareElm.classList.add('square', 'occupied', piece.armyIndex === 0 ? 'white' : 'black', piece.typeCased);
			if (lastMove && lastMove.to === index) {
				squareElm.classList.add('last-move-to');
			}
			if (this.game.isHumanTurn() && this.game.possibleMoves.find(m => m.from === index)) {
				if (this.selectedIndex === -1) {
					squareElm.classList.add('possible-from');
				}
			}
			if (this.selectedIndex !== -1 && this.game.possibleMoves.find(m => m.from === this.selectedIndex && m.to === index)) {
				squareElm.classList.add('possible-to');
			}
			if (piece.type === PieceType.KING && piece.armyIndex !== lastMove?.armyIndex && this.game.isInCheck()) {
				squareElm.classList.add('checked-king');
			}
			if (index === this.selectedIndex) {
				squareElm.classList.add('selected-square');
			}
		}
	}

	updateBoardPiecesUI() {
		const pieceElmsToHandle = Array.from(UiHelper.queryElms(`.board-pieces > .piece`));
		for (let uiIndex = 0; uiIndex < 64; uiIndex++) {
			const index = UiHelper.getModifiedIndex(uiIndex, this.isBoardFlipped);
			const square = this.game.board.squares[index];
			const piece = square.piece;
			if (!piece) {
				continue;
			}
			let pieceElm, pieceElmIndex;
			pieceElmIndex = pieceElmsToHandle.findIndex(elm => elm.dataset.name === piece.name);
			if (pieceElmIndex > -1) {
				pieceElm = pieceElmsToHandle[pieceElmIndex];
				pieceElmsToHandle.splice(pieceElmIndex, 1);
			} else {
				//check name changed due to promotion
				pieceElmIndex = pieceElmsToHandle.findIndex(elm => elm.dataset.name.substring(1) === piece.name.substring(1));
				if (pieceElmIndex > -1) {
					pieceElm = pieceElmsToHandle[pieceElmIndex];
					pieceElm.setAttribute('data-name', piece.name);
					pieceElmsToHandle.splice(pieceElmIndex, 1);
				} else {
					continue;
				}
			}
			pieceElm.dataset.squareIndex = String(index);
			pieceElm.style.transform = `translate(${uiIndex % 8}00%, ${Math.trunc(uiIndex / 8)}00%)`;
			pieceElm.className = '';
			pieceElm.classList.add('piece', piece.armyIndex === 0 ? 'white' : 'black', piece.typeCased);
			if (index === this.selectedIndex) {
				pieceElm.classList.add('clickable');
			}
			if (this.game.possibleMoves.find(m => m.from === index)) {
				pieceElm.classList.add('clickable');
			}
			if (this.selectedIndex !== -1 && this.game.possibleMoves.find(m => m.from === this.selectedIndex && m.to === index)) {
				pieceElm.classList.add('clickable');
			}
		}
		pieceElmsToHandle.forEach(elm => {
			elm.remove();
		});
	}

	updateUI() {
		this.updateBoardSquaresUI();
		this.updateBoardPiecesUI();
		UiFen.updateFenUI(this.game.getCurPosition());
		if (this.game.results.size > 0) {
			UiLog.logGameResult(this.game.results);
		}
	}

	goMove(m: Move | null | undefined) {
		if (m) {
			this.game.move(m);
			UiLog.logMove(m);
			this.afterNewPosition();
		}
	}

	goBotTurn() {
		const m = this.game.getBotMove();
		if (m) {
			this.goMove(m);
		}
	}

	afterNewPosition() {
		this.selectedIndex = -1;
		this.updateUI();
		if (this.game.isBotTurn()) {
			setTimeout(() => {
				this.goBotTurn();
			}, 100);
		}
	}

	handleUiSelection(newIndex: number) {
		if (this.game.results.size > 0) {
			return;
		}
		if (this.selectedIndex === newIndex) {
			this.selectedIndex = -1;
			this.updateUI();
		} else if (this.game.possibleMoves.find(m => newIndex === m.from)) {
			this.selectedIndex = newIndex;
			this.updateUI();
		} else if (this.game.possibleMoves.find(m => m.from === this.selectedIndex && m.to === newIndex)) {
			const moves: Move[] = this.game.possibleMoves.filter(m => m.from === this.selectedIndex && m.to === newIndex);
			if (moves.length === 1) {
				this.goMove(moves[0]);
			} else if (moves.length === 4 && moves.every(m => m.types.has(MoveType.PROMOTION))) {
				UiPromotion.showDialog(this.game.getCurPosition()?.armyIndex || 0, (promotionMoveType: MoveType) => {
					this.goMove(moves.find(m => m.types.has(promotionMoveType)));
				});
			}
		} else {
			this.selectedIndex = -1;
			this.updateUI();
		}
	}

	handleClickSquareElm(event: MouseEvent) {
		if (!event.target) {
			return;
		}
		const elm = event.target as HTMLDivElement;
		if (elm) {
			this.handleUiSelection(Number(elm.dataset.index));
		} else {
			this.handleUiSelection(-1);
		}
	}

	handleClickPieceElm(event: MouseEvent) {
		if (!event.target) {
			return;
		}
		const elm = event.target as HTMLDivElement;
		if (elm) {
			this.handleUiSelection(Number(elm.dataset.squareIndex));
		} else {
			this.handleUiSelection(-1);
		}
	}
}
