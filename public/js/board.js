export class Board {

	constructor(settings) {
		this.settings = settings;
		this.boardPieces = new Array(64).fill('');
	}

	updatePieces(boardPieces) {
		this.boardPieces = boardPieces;
	}
}
