export class Board {
	boardPieces: string[];

	static getSquareNameByIndex(index) {
		return String.fromCharCode(97 + (index % 8)) + String(8 - Math.trunc(index / 8));
	}

	constructor() {
		this.boardPieces = new Array(64).fill('');
	}

	updatePieces(boardPieces) {
		this.boardPieces = boardPieces;
	}
}
