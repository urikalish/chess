import { Position } from '../model/position';
import { Move, MoveType } from '../model/move';
import { Mover } from '../model/mover';
import { BotHelper } from './bot-helper';
import { PieceType } from '../model/piece';

export class Bot1 {
	mover: Mover = new Mover();
	context: { myArmyIndex: number; baseMove: Move } = { myArmyIndex: 0, baseMove: new Move() };

	score(m: Move, isMyMove: boolean): number {
		let score = 0;
		if (m.types.has(MoveType.CHECKMATE)) {
			return isMyMove ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
		}
		const myIndex = this.context.myArmyIndex;
		const enemyIndex = Math.abs(myIndex - 1);
		const pieceCount = Position.getAllPieceCount(m.newPosition);
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

	alphaBeta(m: Move, depth: number, a: number, b: number, maximizingPlayer: boolean) {
		if (depth === 0) {
			return this.score(m, !maximizingPlayer);
		}
		const nextMoves = this.mover.getAllPossibleMoves(m.newPosition);
		if (nextMoves.length === 0) {
			return this.score(m, !maximizingPlayer);
		}
		if (maximizingPlayer) {
			let value = Number.NEGATIVE_INFINITY;
			for (let i = 0; i < nextMoves.length; i++) {
				value = Math.max(value, this.alphaBeta(nextMoves[i], depth - 1, a, b, false));
				a = Math.max(a, value);
				if (value >= b) {
					break;
				}
			}
			return value;
		} else {
			let value = Number.POSITIVE_INFINITY;
			for (let i = 0; i < nextMoves.length; i++) {
				value = Math.min(value, this.alphaBeta(nextMoves[i], depth - 1, a, b, true));
				b = Math.min(b, value);
				if (value <= a) {
					break;
				}
			}
			return value;
		}
	}

	sortMoves(moves: Move[]) {
		BotHelper.randomOrder(moves);
		moves.sort((a, b) => {
			if (a.newPosition.halfMoveClock < 100 && b.newPosition.halfMoveClock >= 100) {
				return -1;
			}
			if (b.newPosition.halfMoveClock < 100 && a.newPosition.halfMoveClock >= 100) {
				return 1;
			}
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
		if (moves.length === 1) {
			return moves[0];
		}
		const m = moves.find(m => m.types.has(MoveType.CHECKMATE));
		if (m) {
			return m;
		}
		this.sortMoves(moves);
		let score;
		let bestMoveIndex = 0;
		let bestMoveScore = Number.NEGATIVE_INFINITY;
		const DEPTH = 3;
		moves.forEach((m, i) => {
			this.context.myArmyIndex = p.armyIndex;
			this.context.baseMove = m;
			score = this.alphaBeta(m, DEPTH, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, false);
			if (score > bestMoveScore) {
				bestMoveIndex = i;
				bestMoveScore = score;
			}
		});
		return moves[bestMoveIndex];
	}
}
