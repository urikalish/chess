import { Position } from '../model/position';
import { Move, MoveType } from '../model/move';
import { Mover } from '../model/mover';
import { BotHelper } from './bot-helper';
import { PieceType } from '../model/piece';

export class Bot0 {
	mover: Mover = new Mover();

	score(p: Position, myIndex: number): number {
		let score = 0;
		const enemyIndex = Math.abs(myIndex - 1);
		const pieceCount = Position.getAllPieceCount(p);
		score += pieceCount[myIndex][PieceType.PAWN];
		score += pieceCount[myIndex][PieceType.KNIGHT] * 3;
		score += pieceCount[myIndex][PieceType.BISHOP] * 3.5;
		score += pieceCount[myIndex][PieceType.ROOK] * 5;
		score += pieceCount[myIndex][PieceType.QUEEN] * 9;
		score -= pieceCount[enemyIndex][PieceType.PAWN];
		score -= pieceCount[enemyIndex][PieceType.KNIGHT] * 3;
		score -= pieceCount[enemyIndex][PieceType.BISHOP] * 3.5;
		score -= pieceCount[enemyIndex][PieceType.ROOK] * 5;
		score -= pieceCount[enemyIndex][PieceType.QUEEN] * 9;
		return score;
	}

	alphaBeta(p: Position, depth: number, a: number, b: number, maximizingPlayer: boolean, myIndex: number) {
		if (depth === 0) {
			return this.score(p, myIndex);
		}
		const moves = this.mover.getAllPossibleMoves(p);
		if (moves.length === 0) {
			return this.score(p, myIndex);
		}
		if (maximizingPlayer) {
			let value = Number.NEGATIVE_INFINITY;
			for (let i = 0; i < moves.length; i++) {
				value = Math.max(value, this.alphaBeta(moves[i].newPosition, depth - 1, a, b, false, myIndex));
				if (value >= b) {
					break;
				}
				a = Math.max(a, value);
			}
			return value;
		} else {
			let value = Number.POSITIVE_INFINITY;
			for (let i = 0; i < moves.length; i++) {
				value = Math.min(value, this.alphaBeta(moves[i].newPosition, depth - 1, a, b, true, myIndex));
				if (value <= a) {
					break;
				}
				b = Math.min(b, value);
			}
			return value;
		}
	}

	sortMoves(moves: Move[]) {
		BotHelper.randomOrder(moves);
		moves.sort((a, b) => {
			if (a.types.has(MoveType.PROMOTION) && !b.types.has(MoveType.PROMOTION)) {
				return -1;
			}
			if (b.types.has(MoveType.PROMOTION) && !a.types.has(MoveType.PROMOTION)) {
				return 1;
			}
			if (a.types.has(MoveType.CAPTURE) && !b.types.has(MoveType.CAPTURE)) {
				return -1;
			}
			if (b.types.has(MoveType.CAPTURE) && !a.types.has(MoveType.CAPTURE)) {
				return 1;
			}
			return 0;
		});
	}

	getMove(p: Position): Move | null {
		const moves = this.mover.getAllPossibleMoves(p);
		if (moves.length === 0) {
			return null;
		}
		const m = moves.find(m => m.types.has(MoveType.CHECKMATE));
		if (m) {
			return m;
		}
		this.sortMoves(moves);
		let score;
		let bestMoveIndex = 0;
		let bestMoveScore = Number.NEGATIVE_INFINITY;
		const DEPTH = 4;
		moves.forEach((m, i) => {
			score = this.alphaBeta(m.newPosition, DEPTH, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, true, p.armyIndex);
			if (score > bestMoveScore) {
				bestMoveIndex = i;
				bestMoveScore = score;
			}
		});
		return moves[bestMoveIndex];
	}
}
