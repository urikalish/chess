import {PieceType} from "./piece-type.js";
import {Settings} from "./settings.js";
import {Game} from "./game.js";

let settings = null;
let game = null;

function getElm(id) {
	return document.getElementById(id);
}

function createSquares(/*settings*/) {
	const boardElm = getElm('board');
	let count = 0;
	for (let r = 0; r < 8; r++) {
		for (let c = 0; c < 8; c++) {
			const squareElm = document.createElement('div');
			squareElm.classList.add('square');
			squareElm.setAttribute('id', `square-${count}`);
			boardElm.appendChild(squareElm);
			count++;
		}
	}
}

function placePieces(board) {
	for (let i = 0; i < 64; i++) {
		const char = board.boardPieces[i];
		if (!char) {
			continue;
		}
		const squareElm = getElm(`square-${i}`);
		squareElm.classList.add(char === char.toLowerCase() ? 'black' : 'white');
		let pieceClass = '';
		switch (char.toLowerCase()) {
			case 'p': {
				pieceClass = PieceType.PAWN;
				break;
			}
			case 'n': {
				pieceClass = PieceType.KNIGHT;
				break;
			}
			case 'b': {
				pieceClass = PieceType.BISHOP;
				break;
			}
			case 'r': {
				pieceClass = PieceType.ROOK;
				break;
			}
			case 'q': {
				pieceClass = PieceType.QUEEN;
				break;
			}
			case 'k': {
				pieceClass = PieceType.KING;
				break;
			}
			default: {
				pieceClass = PieceType.NA;
			}
		}
		squareElm.classList.add(pieceClass);
	}
}

function handleGameUpdate(game) {
	placePieces(game.board);
}

function handleStartGame() {
	settings = new Settings();
	game = new Game(settings);
	createSquares(settings);
	getElm('board-container').classList.remove('hidden');
	game.start(handleGameUpdate);
}

getElm('start-button').addEventListener('click', () => {
	handleStartGame();
});
