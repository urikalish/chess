export class Board {

	static getSquareNameByIndex(index) {
		return String.fromCharCode(97 + index % 8) + String(8 - Math.trunc(index / 8));
	}

	constructor(settings) {
		this.settings = settings;
		this.boardPieces = new Array(64).fill('');
	}

	updatePieces(boardPieces) {
		this.boardPieces = boardPieces;
	}

}
