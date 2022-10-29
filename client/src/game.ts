import { ColorType, PieceType, PlayerType, UserMsgType } from './types';
import { Fen } from './fen';
import { Player } from './player.js';
import { Piece } from './piece.js';
import { Army } from './army.js';
import { Board } from './board.js';
import { Position } from './position';
import { Move } from './move';
import { UILog } from './ui/ui-log';

export class Game {
	players: Player[];
	armies: Army[];
	board: Board;
	positions: Position[];
	moves: Move[];
	startTime = 0;
	onGameUpdate: (Game) => void;

	constructor(player0Type: PlayerType, player0Name: string, player1Type: PlayerType, player1Name: string, fenStr: string, startTime: number, onGameUpdate: (game: Game) => void) {
		this.players = [new Player(0, player0Type, player0Name), new Player(1, player1Type, player1Name)];
		this.armies = [new Army(0, player0Type), new Army(1, player1Type)];
		this.board = new Board();
		this.positions = [];
		this.moves = [];
		this.startTime = startTime;
		this.onGameUpdate = onGameUpdate;
		this.applyFen(fenStr);
	}

	getCurPosition() {
		return this.positions[this.positions.length - 1];
	}

	applyPosition(position: Position) {
		this.positions.push(position);
		for (let i = 0; i < 64; i++) {
			const char = position.pieceData[i];
			if (!char) {
				continue;
			}
			const color = char === char.toUpperCase() ? ColorType.WHITE : ColorType.BLACK;
			const armyIndex = color === ColorType.WHITE ? 0 : 1;
			const piece = this.armies[armyIndex].createAndAddPiece(char.toLowerCase() as PieceType);
			this.board.placePiece(piece, i);
		}
	}

	applyFen(fenStr: string) {
		const position = Fen.parseFenStr(fenStr);
		this.applyPosition(position);
	}

	start() {
		UILog.log('Start game', UserMsgType.GAME_PHASE);
		this.onGameUpdate(this);
	}

	getPiece(name: string): Piece | null {
		return this.armies[0].getPiece(name) || this.armies[1].getPiece(name) || null;
	}

	move(srcSquareIndex: number, dstSquareIndex: number): Move {
		const curPosition = this.getCurPosition();
		const move = this.board.movePiece(new Move(curPosition.activeColor === ColorType.WHITE ? 0 : 1, curPosition.fullMoveNumber, srcSquareIndex, dstSquareIndex));
		if (!move.isLegal) {
			return move;
		}
		if (move.removedPiece) {
			this.armies[move.removedPiece.armyIndex].removePiece(move.removedPiece);
		}
		const newPosition = new Position(
			curPosition.activeColor === ColorType.WHITE ? ColorType.BLACK : ColorType.WHITE,
			curPosition.activeColor === ColorType.WHITE ? curPosition.fullMoveNumber : curPosition.fullMoveNumber + 1,
		);
		this.board.squares.forEach(s => {
			newPosition.pieceData.push(s.piece?.typeCased ?? '');
		});
		this.positions.push(newPosition);
		return move;
	}
}
