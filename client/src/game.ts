import { Army } from './army.js';
import { Player } from './player.js';
import { Board } from './board.js';
import { ColorType } from './types';
import { Move } from './move';

export class Game {
	players: Player[];
	armies: Army[];
	board: Board;
	moves: Move[];
	startTime = 0;
	wholeTurnId: number;
	turnArmyIndex: number;
	onGameUpdate: (Game) => void;

	constructor(player0Type, player0Name, player1Type, player1Name, onGameUpdate) {
		this.players = [new Player(0, player0Type, player0Name), new Player(1, player1Type, player1Name)];
		this.armies = [new Army(0, player0Type), new Army(1, player1Type)];
		this.board = new Board();
		this.moves = [];
		this.wholeTurnId = 1;
		this.turnArmyIndex = 0;
		this.onGameUpdate = onGameUpdate;
	}

	applyFen(fen) {
		for (let i = 0; i < 64; i++) {
			const char = fen.boardPieces[i];
			if (!char) {
				continue;
			}
			const color = char === char.toUpperCase() ? ColorType.WHITE : ColorType.BLACK;
			const armyIndex = color === ColorType.WHITE ? 0 : 1;
			const piece = this.armies[armyIndex].createAndAddPiece(char.toLowerCase());
			this.board.placePiece(piece, i);
		}
	}

	start() {
		this.onGameUpdate(this);
	}

	getPiece(name) {
		return this.armies[0].getPiece(name) || this.armies[1].getPiece(name) || null;
	}

	move(srcSquareIndex: number, dstSquareIndex: number): Move {
		const move = this.board.movePiece(new Move(this.turnArmyIndex, this.wholeTurnId, srcSquareIndex, dstSquareIndex));
		if (move.isLegal) {
			if (move.removedPiece) {
				this.armies[move.removedPiece.armyIndex].removePiece(move.removedPiece);
			}
			if (this.turnArmyIndex === 0) {
				this.turnArmyIndex = 1;
			} else {
				this.turnArmyIndex = 0;
				this.wholeTurnId++;
			}
		}
		return move;
	}
}
