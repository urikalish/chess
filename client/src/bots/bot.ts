import { Position } from '../model/position';
import { Move, MoveType } from '../model/move';
import { Mover } from '../model/mover';
import { BotHelper } from './bot-helper';
import { PieceType } from '../model/piece';

export class Bot {
	mover: Mover = new Mover();
	context: { myArmyIndex: number; baseMove: Move } = { myArmyIndex: 0, baseMove: new Move() };
	depth = 1;
	onProgress: (progress: number, moveName: string) => void;

	constructor(depth: number, onProgress: (progress: number, moveName: string) => void) {
		this.depth = depth;
		this.onProgress = onProgress;
	}

	score(m: Move, isMyMove: boolean): number {
		let score = 0;
		const pieceWorth = {
			[PieceType.PAWN]: 1,
			[PieceType.KNIGHT]: 3.05,
			[PieceType.BISHOP]: 3.33,
			[PieceType.ROOK]: 5.63,
			[PieceType.QUEEN]: 9.5,
		};
		const CHECK_SCORE = 0.5;
		if (m.types.has(MoveType.CHECKMATE)) {
			return isMyMove ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
		}
		if (m.types.has(MoveType.CHECK)) {
			score += isMyMove ? CHECK_SCORE : -1 * CHECK_SCORE;
		}
		const myIndex = this.context.myArmyIndex;
		const enemyIndex = Math.abs(myIndex - 1);
		const pieceCount = Position.getAllPieceCount(m.newPosition);
		score += pieceCount[myIndex][PieceType.PAWN] * pieceWorth[PieceType.PAWN];
		score += pieceCount[myIndex][PieceType.KNIGHT] * pieceWorth[PieceType.KNIGHT];
		score += pieceCount[myIndex][PieceType.BISHOP] * pieceWorth[PieceType.BISHOP];
		score += pieceCount[myIndex][PieceType.ROOK] * pieceWorth[PieceType.ROOK];
		score += pieceCount[myIndex][PieceType.QUEEN] * pieceWorth[PieceType.QUEEN];
		score -= pieceCount[enemyIndex][PieceType.PAWN] * pieceWorth[PieceType.PAWN];
		score -= pieceCount[enemyIndex][PieceType.KNIGHT] * pieceWorth[PieceType.KNIGHT];
		score -= pieceCount[enemyIndex][PieceType.BISHOP] * pieceWorth[PieceType.BISHOP];
		score -= pieceCount[enemyIndex][PieceType.ROOK] * pieceWorth[PieceType.ROOK];
		score -= pieceCount[enemyIndex][PieceType.QUEEN] * pieceWorth[PieceType.QUEEN];
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
		this.sortMoves(nextMoves);
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
			if (a.types.has(MoveType.CHECK) && !b.types.has(MoveType.CHECK)) {
				return -1;
			}
			if (b.types.has(MoveType.CHECK) && !a.types.has(MoveType.CHECK)) {
				return 1;
			}
			if (a.types.has(MoveType.CASTLING) && !b.types.has(MoveType.CASTLING)) {
				return -1;
			}
			if (b.types.has(MoveType.CASTLING) && !a.types.has(MoveType.CASTLING)) {
				return 1;
			}
			return 0;
		});
	}

	goComputeMove(p: Position) {
		this.onProgress(0, '');
		const moves = this.mover.getAllPossibleMoves(p);
		if (moves.length === 0) {
			this.onProgress(1, '');
		}
		if (moves.length === 1) {
			this.onProgress(1, moves[0].name);
			return moves[0];
		}
		const m = moves.find(m => m.types.has(MoveType.CHECKMATE));
		if (m) {
			this.onProgress(1, m.name);
		}
		this.sortMoves(moves);
		let score;
		let bestMoveIndex = 0;
		let bestMoveScore = Number.NEGATIVE_INFINITY;
		moves.forEach((m, i) => {
			this.context.myArmyIndex = p.armyIndex;
			this.context.baseMove = m;
			score = this.alphaBeta(m, this.depth, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, false);
			if (score > bestMoveScore) {
				bestMoveIndex = i;
				bestMoveScore = score;
			}
			this.onProgress((i + 1) / moves.length, '');
		});
		this.onProgress(1, '');
		setTimeout(() => {
			this.onProgress(1, moves[bestMoveIndex].name);
		}, 100);
	}
}
