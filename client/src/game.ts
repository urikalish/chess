import { ColorType, MoveType, PieceType, PlayerType } from './types';
import { Helper } from './helper';
import { Fen } from './fen';
import { Player } from './player';
import { Army } from './army';
import { Board } from './board';
import { Move } from './move';
import { Position } from './position';
import { UiLog } from './ui/ui-log';
import { Mover } from './mover';

export class Game {
	players: Player[];
	armies: Army[];
	board: Board;
	positions: Position[] = [];
	moves: Move[] = [];
	possibleMoves: Move[] = [];
	startTime = 0;
	mover = new Mover();

	constructor(player0Type: PlayerType, player0Name: string, player1Type: PlayerType, player1Name: string, fenStr: string, startTime: number) {
		this.players = [new Player(0, player0Type, player0Name), new Player(1, player1Type, player1Name)];
		this.armies = [new Army(0, player0Type), new Army(1, player1Type)];
		this.board = new Board();
		this.startTime = startTime;
		this.applyFen(fenStr);
	}

	getCurPosition(): Position | null {
		return this.positions.length ? this.positions[this.positions.length - 1] : null;
	}

	getCurMove(): Move | null {
		return this.moves.length ? this.moves[this.moves.length - 1] : null;
	}

	pushMove(move: Move) {
		console.log(move.name);
		UiLog.logMove(move);
		this.moves.push(move);
	}

	pushPosition(position: Position) {
		console.log(Fen.getFenStr(position));
		this.positions.push(position);
		this.possibleMoves = this.mover.getAllPossibleMoves(position);
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

	move(move: Move | undefined): Move | null {
		if (!move) {
			return null;
		}
		const fromSquare = this.board.squares[move.from];
		const piece = fromSquare.piece;
		if (!piece) {
			return null;
		}
		const targetPieceName = move.captureIndex === -1 ? '' : this.board.squares[move.captureIndex].piece?.name || '';
		if (targetPieceName) {
			this.armies[Helper.flipArmyIndex(move.armyIndex)].removePiece(targetPieceName);
		}
		fromSquare.clearPiece();
		this.board.placePiece(piece, move.to);
		if (move.types.has(MoveType.PROMOTION)) {
			piece.promoteByMoveType(move.types);
		}
		this.pushMove(move);
		this.pushPosition(move.newPosition);
		return move;
	}
}
