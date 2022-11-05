import { Player } from '../player';
import { Piece } from '../piece';
import { Square } from '../square';
import { Board } from '../board';
import { UiHelper } from './ui-helper';
import { PlayerType } from '../types';

export class UiInit {
	createPlayersInfoUI(players: Player[], isBoardFlipped: boolean) {
		const colorElms = UiHelper.queryElms('.info-player-color');
		colorElms[0].style.backgroundColor = isBoardFlipped ? '#fff' : '#000';
		colorElms[1].style.backgroundColor = isBoardFlipped ? '#000' : '#fff';
		const nameElms = UiHelper.queryElms('.info-player-name');
		nameElms[0].innerText = isBoardFlipped ? players[0].name : players[1].name;
		nameElms[1].innerText = isBoardFlipped ? players[1].name : players[0].name;
		nameElms[0].classList.add(players[isBoardFlipped ? 0 : 1].type === PlayerType.HUMAN ? 'player-human' : 'player-machine');
		nameElms[1].classList.add(players[isBoardFlipped ? 1 : 0].type === PlayerType.HUMAN ? 'player-human' : 'player-machine');
	}

	createBoardGuttersUI(isBoardFlipped: boolean) {
		const gutterElms = UiHelper.queryElms('.board-gutter');
		for (let g = 0; g < 4; g++) {
			for (let index = 0; index < 8; index++) {
				const modifiedIndex = g % 2 === 0 ? (isBoardFlipped ? 7 - index : index) : isBoardFlipped ? index + 1 : 8 - index;
				const markElm = document.createElement('div');
				markElm.classList.add('board-gutter-label');
				markElm.innerText = g % 2 === 0 ? String.fromCharCode(97 + modifiedIndex) : String(modifiedIndex);
				gutterElms[g].appendChild(markElm);
			}
		}
	}

	createBoardSquaresUI(isBoardFlipped: boolean, onClickSquare: (MouseEvent) => void) {
		const boardSquaresElm = UiHelper.getElm('board-squares');
		if (!boardSquaresElm) {
			return;
		}
		for (let index = 0; index < 64; index++) {
			const modifiedIndex = UiHelper.getModifiedIndex(index, isBoardFlipped);
			const squareName = Square.getNameByIndex(modifiedIndex);
			const squareElm = document.createElement('div');
			squareElm.setAttribute('data-index', String(modifiedIndex));
			squareElm.setAttribute('data-ui-index', String(index));
			squareElm.setAttribute('data-name', squareName);
			squareElm.classList.add('square', 'empty');
			squareElm.addEventListener('click', onClickSquare);
			boardSquaresElm.appendChild(squareElm);
		}
	}

	createOnePieceElm(piece: Piece, onClickPiece: (MouseEvent) => void) {
		const boardPiecesElm = document.getElementById('board-pieces');
		if (!boardPiecesElm) {
			return;
		}
		const pieceElm = document.createElement('div');
		pieceElm.setAttribute('data-name', piece.name);
		pieceElm.classList.add('piece', piece.armyIndex === 0 ? 'white' : 'black', piece.typeCased);
		pieceElm.addEventListener('click', onClickPiece);
		boardPiecesElm.appendChild(pieceElm);
		return pieceElm;
	}

	createAllPieceElms(board: Board, isBoardFlipped, onClickPiece: (MouseEvent) => void) {
		const boardSquaresElm = UiHelper.getElm('board-squares');
		if (!boardSquaresElm) {
			return;
		}
		for (let index = 0; index < 64; index++) {
			const modifiedIndex = UiHelper.getModifiedIndex(index, isBoardFlipped);
			const square = board.squares[modifiedIndex];
			if (!square.piece) {
				continue;
			}
			this.createOnePieceElm(square.piece, onClickPiece);
		}
	}

	createGameUI(players: Player[], board: Board, isBoardFlipped: boolean, onClickSquare: (MouseEvent) => void, onclickPiece: (MouseEvent) => void) {
		this.createPlayersInfoUI(players, isBoardFlipped);
		this.createBoardGuttersUI(isBoardFlipped);
		this.createBoardSquaresUI(isBoardFlipped, onClickSquare);
		this.createAllPieceElms(board, isBoardFlipped, onclickPiece);
		const pageBgImageElm = UiHelper.getElm('page-bg-img');
		const mainContentElm = UiHelper.getElm('main-content');
		const welcomePanelElm = UiHelper.getElm('welcome-panel');
		if (!pageBgImageElm || !mainContentElm || !welcomePanelElm) {
			return;
		}
		pageBgImageElm.classList.add('game-on');
		mainContentElm.classList.remove('none');
		welcomePanelElm.classList.add('none');
	}
}
