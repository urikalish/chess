import { Player, PlayerGenderType, PlayerType } from '../model/player';
import { Piece } from '../model/piece';
import { Square } from '../model/square';
import { Board } from '../model/board';
import { UiHelper } from './ui-helper';
import { UiDesign, UiPieceDesign } from './ui-design';
import { UiLog } from './ui-log';
import { Analytics, AnalyticsAction, AnalyticsCategory } from '../services/analytics';

export class UiInit {
	createPlayersInfoUI(players: Player[], isBoardFlipped: boolean) {
		const colorElms = UiHelper.queryElms('.player-status-color');
		colorElms[0].style.backgroundColor = UiDesign.getUiPieceColor(isBoardFlipped ? 0 : 1);
		colorElms[1].style.backgroundColor = UiDesign.getUiPieceColor(isBoardFlipped ? 1 : 0);
		const nameElms = UiHelper.queryElms('.player-status-name');
		nameElms[0].innerText = isBoardFlipped ? players[0].name : players[1].name;
		nameElms[1].innerText = isBoardFlipped ? players[1].name : players[0].name;
		nameElms[0].classList.add(
			players[isBoardFlipped ? 0 : 1].type === PlayerType.BOT
				? 'player-bot'
				: players[isBoardFlipped ? 0 : 1].gender === PlayerGenderType.MALE
				? 'player-male'
				: 'player-female',
		);
		nameElms[1].classList.add(
			players[isBoardFlipped ? 1 : 0].type === PlayerType.BOT
				? 'player-bot'
				: players[isBoardFlipped ? 1 : 0].gender === PlayerGenderType.MALE
				? 'player-male'
				: 'player-female',
		);
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

	createBoardSquaresUI(isBoardFlipped: boolean, shouldMarkPossibleMoves: boolean, onClickSquare: (MouseEvent) => void) {
		const boardSquaresElm = UiHelper.getElm('board-squares');
		if (!boardSquaresElm) {
			return;
		}
		boardSquaresElm.classList.toggle('mark-possible-moves', shouldMarkPossibleMoves);
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

	setUpActionButtons() {
		const copyMovesButtonElm = UiHelper.getElm('copy-moves-button');
		const infoLogElm = UiHelper.getElm('info-log');
		if (copyMovesButtonElm && infoLogElm) {
			copyMovesButtonElm.addEventListener('click', () => {
				Analytics.sendEvent(AnalyticsCategory.USER_ACTION, AnalyticsAction.USER_ACTION_COPY_MOVES);
				// eslint-disable-next-line @typescript-eslint/no-empty-function
				navigator.clipboard.writeText(infoLogElm.innerText).then(() => {});
			});
		}
		const copyFenButtonElm = UiHelper.getElm('copy-fen-button');
		const infoFenTextElm = UiHelper.getElm('info-fen-text');
		if (copyFenButtonElm && infoFenTextElm) {
			copyFenButtonElm.addEventListener('click', () => {
				Analytics.sendEvent(AnalyticsCategory.USER_ACTION, AnalyticsAction.USER_ACTION_COPY_FEN);
				// eslint-disable-next-line @typescript-eslint/no-empty-function
				navigator.clipboard.writeText(infoFenTextElm.innerText).then(() => {});
			});
		}
		const restartButtonElm = UiHelper.getElm('restart-button');
		if (restartButtonElm) {
			restartButtonElm.addEventListener('click', () => {
				const shouldRestart = !window['game'].hasMoves() || window['game'].isEnded() || confirm('Restart game?');
				if (shouldRestart) {
					Analytics.sendEvent(AnalyticsCategory.USER_ACTION, AnalyticsAction.USER_ACTION_RESTART_GAME);
					location.reload();
				}
			});
		}
	}

	createGameUI(
		players: Player[],
		board: Board,
		isBoardFlipped: boolean,
		pieceDesign: UiPieceDesign,
		shouldMarkPossibleMoves: boolean,
		onClickSquare: (MouseEvent) => void,
		onclickPiece: (MouseEvent) => void,
	) {
		UiDesign.setPieceDesign(pieceDesign);
		this.createPlayersInfoUI(players, isBoardFlipped);
		this.createBoardGuttersUI(isBoardFlipped);
		this.createBoardSquaresUI(isBoardFlipped, shouldMarkPossibleMoves, onClickSquare);
		this.createAllPieceElms(board, isBoardFlipped, onclickPiece);
		this.setUpActionButtons();
		UiLog.setScrollListener();
		const pageBgImageElm = UiHelper.getElm('page-bg-img');
		const mainContentElm = UiHelper.getElm('main-content');
		const welcomePanelElm = UiHelper.getElm('welcome-panel');
		if (!pageBgImageElm || !mainContentElm || !welcomePanelElm) {
			return;
		}
		pageBgImageElm.classList.add('game-on');
		mainContentElm.classList.remove('none');
		welcomePanelElm.classList.add('none');
		Analytics.sendEvent(AnalyticsCategory.PLAYER_IDENTITY, AnalyticsAction.PLAYER_IDENTITY_PLAYER_TYPE, players[0].type);
		Analytics.sendEvent(AnalyticsCategory.PLAYER_IDENTITY, AnalyticsAction.PLAYER_IDENTITY_PLAYER_GENDER, players[0].gender);
		Analytics.sendEvent(AnalyticsCategory.PLAYER_IDENTITY, AnalyticsAction.PLAYER_IDENTITY_PLAYER_NAME, players[0].name);
		Analytics.sendEvent(AnalyticsCategory.PLAYER_IDENTITY, AnalyticsAction.PLAYER_IDENTITY_PLAYER_TYPE, players[1].type);
		Analytics.sendEvent(AnalyticsCategory.PLAYER_IDENTITY, AnalyticsAction.PLAYER_IDENTITY_PLAYER_GENDER, players[1].gender);
		Analytics.sendEvent(AnalyticsCategory.PLAYER_IDENTITY, AnalyticsAction.PLAYER_IDENTITY_PLAYER_NAME, players[1].name);
		Analytics.sendEvent(AnalyticsCategory.UI_DESIGN, AnalyticsAction.UI_DESIGN_PIECES, pieceDesign);
		Analytics.sendEvent(AnalyticsCategory.UI_DESIGN, AnalyticsAction.UI_DESIGN_SHOW_MOVES, String(shouldMarkPossibleMoves));
	}
}
