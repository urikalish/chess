import { MoveType, PlayerType } from '../types';
import { Game } from '../game';
import { UiHelper } from './ui-helper';
import { UiInit } from './ui-init';
import { UiFen } from './ui-fen';

export class UiMain {
	game: Game;
	isBoardFlipped = false;
	selectedIndex = -1;

	constructor(game: Game) {
		this.game = game;
	}

	createGameUI() {
		this.isBoardFlipped = this.game.players[0].type === PlayerType.COMPUTER && this.game.players[1].type === PlayerType.HUMAN;
		const uiInit = new UiInit();
		uiInit.createGameUI(this.game.players, this.game.board, this.isBoardFlipped, this.handleClickSquareElm.bind(this), this.handleClickPieceElm.bind(this));
	}

	goMove(from: number, to: number) {
		const move = this.game.move(from, to);
		if (!move) {
			return;
		}
		if (move.types.has(MoveType.CAPTURE)) {
			const elm = UiHelper.querySquareIndexElm(move.to);
			if (elm && elm.dataset && elm?.dataset.name) {
				this.removePieceElm(elm.dataset.name);
			}
		}
	}

	handleUiSelection(newIndex: number) {
		if (this.selectedIndex === newIndex) {
			this.selectedIndex = -1;
		} else if (this.game.possibleMoves.find(m => newIndex === m.from)) {
			this.selectedIndex = newIndex;
		} else if (this.game.possibleMoves.find(m => this.selectedIndex === m.from && newIndex === m.to)) {
			this.goMove(this.selectedIndex, newIndex);
			this.selectedIndex = -1;
		} else {
			this.selectedIndex = -1;
		}
		this.updateUI();
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

	removePieceElm(pieceNme: string) {
		const elm = UiHelper.queryNameElm(pieceNme);
		if (elm) {
			elm.remove();
		}
	}

	updateBoardUI() {
		for (let uiIndex = 0; uiIndex < 64; uiIndex++) {
			const squareElm = UiHelper.queryUiIndexElm(uiIndex);
			if (!squareElm) {
				return;
			}
			const index = UiHelper.getModifiedIndex(uiIndex, this.isBoardFlipped);
			const lastMove = this.game.getCurMove();
			squareElm.className = '';
			const square = this.game.board.squares[index];
			if (square.isEmpty()) {
				squareElm.classList.add('square', 'empty');
				if (lastMove && lastMove.from === index) {
					squareElm.classList.add('last-move-from');
				}
				if (this.selectedIndex !== -1 && this.game.possibleMoves.find(m => m.from === this.selectedIndex && m.to === index)) {
					squareElm.classList.add('possible-to');
				}
				continue;
			}
			const piece = square.piece;
			if (!piece) {
				continue;
			}
			const pieceElm = UiHelper.queryNameElm(piece.name);
			if (!pieceElm) {
				return;
			}
			pieceElm.dataset.squareIndex = String(index);
			pieceElm.style.transform = `translate(${uiIndex % 8}00%, ${Math.trunc(uiIndex / 8)}00%)`;
			pieceElm.className = '';
			squareElm.classList.add('square', 'occupied', piece.armyIndex === 0 ? 'white' : 'black', piece.typeCased);
			pieceElm.classList.add('piece', piece.armyIndex === 0 ? 'white' : 'black', piece.typeCased);
			if (lastMove && lastMove.to === index) {
				squareElm.classList.add('last-move-to');
			}
			if (index === this.selectedIndex) {
				squareElm.classList.add('selected-square');
				pieceElm.classList.add('clickable');
			}
			if (this.game.possibleMoves.find(m => m.from === index)) {
				pieceElm.classList.add('clickable');
				if (this.selectedIndex === -1) {
					squareElm.classList.add('possible-from');
				}
			}
			if (this.selectedIndex !== -1 && this.game.possibleMoves.find(m => m.from === this.selectedIndex && m.to === index)) {
				squareElm.classList.add('possible-to');
				pieceElm.classList.add('clickable');
			}
		}
	}

	updateUI() {
		this.updateBoardUI();
		UiFen.updateFenUI(this.game.getCurPosition());
	}
}
