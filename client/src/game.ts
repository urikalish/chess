import { ColorType, MoveType, PieceType, PlayerType, UserMsgType } from './types';
import { Helper } from './helper';
import { Fen } from './fen';
import { Player } from './player';
import { Piece } from './piece';
import { Army } from './army';
import { Board } from './board';
import { Move } from './move';
import { Position } from './position';
import { UiLog } from './ui/ui-log';
import { Engine } from './engine';

export class Game {
	players: Player[];
	armies: Army[];
	board: Board;
	positions: Position[] = [];
	moves: Move[] = [];
	possibleMoves: Move[] = [];
	startTime = 0;
	onGameUpdate: (Game) => void;
	engine = new Engine();

	constructor(player0Type: PlayerType, player0Name: string, player1Type: PlayerType, player1Name: string, fenStr: string, startTime: number, onGameUpdate: (game: Game) => void) {
		this.players = [new Player(0, player0Type, player0Name), new Player(1, player1Type, player1Name)];
		this.armies = [new Army(0, player0Type), new Army(1, player1Type)];
		this.board = new Board();
		this.startTime = startTime;
		this.onGameUpdate = onGameUpdate;
		this.applyFen(fenStr);
	}

	start() {
		UiLog.log('Start game', UserMsgType.GAME_PHASE);
		this.onGameUpdate(this);
	}

	getCurPosition(): Position | null {
		return this.positions.length ? this.positions[this.positions.length - 1] : null;
	}

	getCurMove(): Move | null {
		return this.moves.length ? this.moves[this.moves.length - 1] : null;
	}

	pushPosition(position: Position) {
		this.positions.push(position);
		this.possibleMoves = this.engine.getAllPossibleMoves(position);
	}

	applyFen(fenStr: string) {
		const position = Fen.parseFenStr(fenStr);
		this.pushPosition(position);
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

	updatePosition(): Position | null {
		const curPosition = this.getCurPosition();
		if (!curPosition) {
			return null;
		}
		const newPosition = new Position(
			Helper.flipArmyIndex(curPosition.activeArmyIndex),
			curPosition.activeArmyIndex === 0 ? curPosition.fullMoveNumber : curPosition.fullMoveNumber + 1,
		);
		this.board.squares.forEach(s => {
			newPosition.pieceData.push(s.piece?.typeCased ?? '');
		});
		this.pushPosition(newPosition);
		return newPosition;
	}

	move(from: number, to: number): Move | null {
		const curPosition = this.getCurPosition();
		const fromSquare = this.board.squares[from];
		const movingPiece = fromSquare.piece;
		const pieceName = movingPiece?.name;
		if (!curPosition || !pieceName) {
			return null;
		}
		const move = new Move(curPosition.fullMoveNumber, curPosition.activeArmyIndex, from, to, MoveType.NORMAL);
		const toSquare = this.board.squares[to];
		const targetPiece: Piece | null = toSquare.piece;
		fromSquare.clearPiece();
		toSquare.clearPiece();
		this.board.placePiece(movingPiece, to);
		move.type = targetPiece ? MoveType.CAPTURE : MoveType.NORMAL;
		this.moves.push(move);
		if (targetPiece) {
			this.armies[Helper.flipArmyIndex(move.armyIndex)].removePiece(targetPiece.name);
		}
		this.updatePosition();
		return move;
	}
}
