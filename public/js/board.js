import {Fen} from "./fen.js";

export class Board {

	constructor(settings) {
		this.settings = settings;
		this.boardPieces = new Array(64).fill('');
	}

	updatePieces(fen) {
		this.boardPieces = Fen.parseFenStr(fen).boardPieces;
	}
}
