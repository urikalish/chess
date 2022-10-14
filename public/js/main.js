import {Fen} from "./fen.js";
import {Settings} from "./settings.js";
import {Piece} from "./piece.js";
import {Board} from "./board.js";
import {Game} from "./game.js";

let settings = null;
let game = null;

function getElm(id) {
	return document.getElementById(id);
}

function createSquares(settings) {
	const boardElm = getElm('board');
	for (let index = 0; index < 64; index++) {
		const modifiedIndex = settings.flippedBoard ? 63 - index : index;
		const squareName = Board.getSquareNameByIndex(modifiedIndex);
		const squareElm = document.createElement('div');
		squareElm.setAttribute('data-index', String(index));
		squareElm.setAttribute('data-name', squareName);
		boardElm.appendChild(squareElm);
	}
}

function createBoardMarkings(settings) {
	const gutterElms = document.querySelectorAll('.board-markings-gutter');
	for (let g = 0; g < 4; g++) {
		for (let index = 0; index < 8; index++) {
			const modifiedIndex = g < 2
				? (settings.flippedBoard ? 7 - index : index)
				: (settings.flippedBoard ? index + 1 : 8 - index);
			const markElm = document.createElement('div');
			markElm.classList.add('board-markings-label');
			markElm.innerText = g < 2
				? String.fromCharCode(97 + modifiedIndex)
				: String(modifiedIndex);
				gutterElms[g].appendChild(markElm);
		}
	}
}

function placePieces(board) {
	for (let i = 0; i < 64; i++) {
		const squareElm = document.querySelector(`[data-index="${i}"]`);
		squareElm.className = '';
		const modifiedIndex = settings.flippedBoard ? 63 - i : i;
		const char = board.boardPieces[modifiedIndex];
		if (!char) {
			squareElm.classList.add('square', 'empty');
			continue;
		}
		squareElm.classList.add('square', 'piece', char === char.toLowerCase() ? 'black' : 'white', Piece.getNameFromOneLetter(char));
	}
}

function handleGameUpdate(game) {
	placePieces(game.board);
}

function handleStartGame() {
	settings = new Settings();
	const startingFen = getElm('fen-text').value || Fen.default;
	const playerWhiteElm = getElm('player-color-selector-white');
	settings.playerIsWhite = playerWhiteElm.classList.contains('selected');
	settings.flippedBoard = !settings.playerIsWhite;
	game = new Game(settings);
	createSquares(settings);
	createBoardMarkings(settings);
	getElm('board-container').classList.remove('none');
	getElm('welcome-panel').classList.add('none');
	game.start(startingFen, handleGameUpdate);
}

function init() {
	getElm('fen-text').value = Fen.default;
	const playerWhiteElm = getElm('player-color-selector-white');
	const playerBlackElm = getElm('player-color-selector-black');
	playerWhiteElm.addEventListener('click', () => {
		playerWhiteElm.classList.add('selected');
		playerBlackElm.classList.remove('selected');
	});
	playerBlackElm.addEventListener('click', () => {
		playerBlackElm.classList.add('selected');
		playerWhiteElm.classList.remove('selected');
	});
	getElm('start-button').addEventListener('click', () => {
		handleStartGame();
	});
}

init();
