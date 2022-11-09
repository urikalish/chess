import { ColorType, MoveType, PieceType, PlayerType } from './types';
import { Fen } from './fen';
import { Player } from './player';
import { Piece } from './piece';
import { Army } from './army';
import { Board } from './board';
import { Position } from './position';
import { Move } from './move';
import { Mover } from './mover';
import { UiLog } from './ui/ui-log';

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

	pushMove(m: Move) {
		console.log(m.name);
		UiLog.logMove(m);
		this.moves.push(m);
	}

	pushPosition(p: Position) {
		console.log(Fen.getFenStr(p));
		this.positions.push(p);
		//const startTime = Date.now();
		this.possibleMoves = this.mover.getAllPossibleMoves(p);
		//console.log(`${Date.now() - startTime}ms`);
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

	isInCheck() {
		const p = this.getCurPosition();
		if (!p) {
			return false;
		}
		return this.mover.isSquareAttacked(p, this.board.getKingIndex(p.armyIndex), Army.flipArmyIndex(p.armyIndex));
	}

	move(m: Move | undefined): Move | null {
		if (!m) {
			return null;
		}
		const fromSquare = this.board.squares[m.from];
		const piece = fromSquare.piece;
		if (!piece) {
			return null;
		}
		const targetPieceName = m.captureIndex === -1 ? '' : this.board.squares[m.captureIndex].piece?.name || '';
		if (targetPieceName) {
			this.board.clearSquareByPieceName(targetPieceName);
			this.armies[Army.flipArmyIndex(m.armyIndex)].removePiece(targetPieceName);
		}
		this.board.movePiece(piece, m.from, m.to);
		if (m.types.has(MoveType.PROMOTION)) {
			Piece.promoteByMoveType(piece, m.types);
		}
		if (m.additionalMove) {
			const additionalMovePiece = this.board.squares[m.additionalMove.from].piece;
			if (additionalMovePiece) {
				this.board.movePiece(additionalMovePiece, m.additionalMove.from, m.additionalMove.to);
			}
		}
		this.pushMove(m);
		this.pushPosition(m.newPosition);
		return m;
	}
}
