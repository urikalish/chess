import { Position } from '../model/position';
import { Move, MoveType } from '../model/move';
import { Mover } from '../model/mover';
import { BotHelper } from './bot-helper';
import { PieceType } from '../model/piece';
import { Fen } from '../model/fen';
import { Openings } from './openings';

export class Bot {
	mover: Mover = new Mover();
	depth = 0;
	useOpenings = false;
	myArmyIndex = 0;
	context: { baseMove: Move; positionScores: object } = { baseMove: new Move(), positionScores: {} };
	onProgress: (progress: number, moveName: string) => void;

	constructor(depth: number, useOpenings: boolean, onProgress: (progress: number, moveName: string) => void) {
		this.depth = depth;
		this.useOpenings = useOpenings;
		this.onProgress = onProgress;
	}

	hash(str) {
		let hash = 0;
		let i;
		let l;
		for (i = 0, l = str.length; i < l; i++) {
			hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
		}
		return hash;
	}

	score(m: Move, isMyMove: boolean): number {
		const key = this.hash(Fen.getFenStr(m.newPosition, false, false, false, false, false));
		if (this.context.positionScores[key]) {
			return this.context.positionScores[key];
		}
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
		const enemyArmyIndex = Math.abs(this.myArmyIndex - 1);
		const pieceCount = Position.getAllPieceCount(m.newPosition);
		score += pieceCount[this.myArmyIndex][PieceType.PAWN] * pieceWorth[PieceType.PAWN];
		score += pieceCount[this.myArmyIndex][PieceType.KNIGHT] * pieceWorth[PieceType.KNIGHT];
		score += pieceCount[this.myArmyIndex][PieceType.BISHOP] * pieceWorth[PieceType.BISHOP];
		score += pieceCount[this.myArmyIndex][PieceType.ROOK] * pieceWorth[PieceType.ROOK];
		score += pieceCount[this.myArmyIndex][PieceType.QUEEN] * pieceWorth[PieceType.QUEEN];
		score -= pieceCount[enemyArmyIndex][PieceType.PAWN] * pieceWorth[PieceType.PAWN];
		score -= pieceCount[enemyArmyIndex][PieceType.KNIGHT] * pieceWorth[PieceType.KNIGHT];
		score -= pieceCount[enemyArmyIndex][PieceType.BISHOP] * pieceWorth[PieceType.BISHOP];
		score -= pieceCount[enemyArmyIndex][PieceType.ROOK] * pieceWorth[PieceType.ROOK];
		score -= pieceCount[enemyArmyIndex][PieceType.QUEEN] * pieceWorth[PieceType.QUEEN];
		this.context.positionScores[key] = score;
		return score;
	}

	alphaBeta(m: Move, depth: number, a: number, b: number, maximizingPlayer: boolean) {
		if (depth === 0) {
			return this.score(m, maximizingPlayer);
		}
		const nextMoves = this.mover.getAllPossibleMoves(m.newPosition);
		if (nextMoves.length === 0) {
			return this.score(m, maximizingPlayer);
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

	notifyMove(moveName: string) {
		this.onProgress(1, '');
		setTimeout(() => {
			this.onProgress(1, moveName);
		}, 0);
	}

	getCannedMoveName(p: Position, moveNames: string[]): string {
		if (!this.useOpenings || p.fullMoveNum > 10) {
			return '';
		}
		const movesStr = moveNames.join(' ');
		const possibleOpenings: string[] = [];
		Openings.goodOpenings.forEach(opening => {
			if (opening.moves.startsWith(movesStr)) {
				const nextMoveName = opening.moves.substring(movesStr.length + 1).split(' ')[0];
				if (nextMoveName) {
					possibleOpenings.push(nextMoveName);
				}
			}
		});
		return possibleOpenings.length === 0 ? '' : possibleOpenings[Math.trunc(Math.random() * possibleOpenings.length)];
	}

	goComputeMove(p: Position, moveNames: string[]) {
		this.onProgress(0, '');
		const moves = this.mover.getAllPossibleMoves(p);
		if (moves.length === 0) {
			this.notifyMove('');
			return;
		}
		if (moves.length === 1) {
			this.notifyMove(moves[0].name);
			return;
		}
		let m = moves.find(m => m.types.has(MoveType.CHECKMATE));
		if (m) {
			this.notifyMove(m.name);
			return;
		}
		const cannedMoveName = this.getCannedMoveName(p, moveNames);
		if (cannedMoveName) {
			m = moves.find(m => m.name === cannedMoveName);
			if (m) {
				this.notifyMove(m.name);
				return;
			}
		}
		this.myArmyIndex = p.armyIndex;
		this.context.positionScores = {};
		let score;
		let bestMoveIndex = 0;
		let bestMoveScore = Number.NEGATIVE_INFINITY;
		this.sortMoves(moves);
		moves.forEach((m, i) => {
			this.context.baseMove = m;
			score = this.alphaBeta(m, this.depth, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, false);
			if (score > bestMoveScore) {
				bestMoveIndex = i;
				bestMoveScore = score;
			}
			this.onProgress((i + 1) / moves.length, '');
		});
		this.context.positionScores = {};
		this.notifyMove(moves[bestMoveIndex].name);
		return;
	}
}
