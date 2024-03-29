import { Position } from '../model/position';
import { Move, MoveType } from '../model/move';
import { Mover } from '../model/mover';
import { PieceType } from '../model/piece';
import { Fen } from '../model/fen';
import { Openings } from './openings';

export class Bot {
	mover: Mover;
	myArmyIndex: number;
	context: { baseMove: Move; positionScores: object };
	onProgress: (progress: number, moveName: string) => void;
	config = {
		depth: 0,
		useOpenings: false,
		pieceWorth: {
			[PieceType.PAWN]: 100,
			[PieceType.KNIGHT]: 305,
			[PieceType.BISHOP]: 333,
			[PieceType.ROOK]: 563,
			[PieceType.QUEEN]: 950,
		},
		checkScore: 50,
	};

	constructor(armyIndex: number, depth: number, useOpenings: boolean, onProgress: (progress: number, moveName: string) => void) {
		this.mover = new Mover();
		this.myArmyIndex = armyIndex;
		this.context = { baseMove: new Move(), positionScores: {} };
		this.config.depth = depth;
		this.config.useOpenings = useOpenings;
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

	scorePieces(p: Position, myArmyIndex: number): number {
		const pieceCount = Position.getAllPieceCount(p);
		return (
			(pieceCount[0][PieceType.PAWN] * this.config.pieceWorth[PieceType.PAWN] +
				pieceCount[0][PieceType.KNIGHT] * this.config.pieceWorth[PieceType.KNIGHT] +
				pieceCount[0][PieceType.BISHOP] * this.config.pieceWorth[PieceType.BISHOP] +
				pieceCount[0][PieceType.ROOK] * this.config.pieceWorth[PieceType.ROOK] +
				pieceCount[0][PieceType.QUEEN] * this.config.pieceWorth[PieceType.QUEEN] -
				pieceCount[1][PieceType.PAWN] * this.config.pieceWorth[PieceType.PAWN] -
				pieceCount[1][PieceType.KNIGHT] * this.config.pieceWorth[PieceType.KNIGHT] -
				pieceCount[1][PieceType.BISHOP] * this.config.pieceWorth[PieceType.BISHOP] -
				pieceCount[1][PieceType.ROOK] * this.config.pieceWorth[PieceType.ROOK] -
				pieceCount[1][PieceType.QUEEN] * this.config.pieceWorth[PieceType.QUEEN]) *
			(myArmyIndex === 0 ? 1 : -1)
		);
	}

	score(m: Move, isMyMove: boolean): number {
		const key = this.hash(Fen.getFenStr(m.newPosition, true, false, false, false, false));
		if (this.context.positionScores[key]) {
			return this.context.positionScores[key];
		}
		let score = 0;
		if (m.types.has(MoveType.CHECKMATE)) {
			return isMyMove ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
		}
		if (m.types.has(MoveType.CHECK)) {
			score += isMyMove ? this.config.checkScore : -1 * this.config.checkScore;
		}
		score += this.scorePieces(m.newPosition, this.myArmyIndex);
		this.context.positionScores[key] = score;
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
		}, 100);
	}

	getCannedMoveName(p: Position, moveNames: string[]): string {
		if (!this.config.useOpenings || p.fullMoveNum > 10) {
			return '';
		}
		const movesStr = moveNames.join(' ');
		const possibleOpenings: string[] = [];
		Openings.openings[this.myArmyIndex].forEach(opening => {
			if (opening.moves.startsWith(movesStr)) {
				const nextMoveName = opening.moves.substring(movesStr ? movesStr.length + 1 : 0).split(' ')[0];
				if (nextMoveName) {
					possibleOpenings.push(nextMoveName);
				}
			}
		});
		return possibleOpenings.length === 0 ? '' : possibleOpenings[Math.trunc(Math.random() * possibleOpenings.length)];
	}

	goComputeMove(p: Position, moveNames: string[]) {
		this.onProgress(0, '');
		this.context.positionScores = {};
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
		// const piecesWorthScore = this.scorePiecesWorth(p);
		let score;
		let bestMoveScore = Number.NEGATIVE_INFINITY;
		let bestMoves: Move[] = [];
		this.sortMoves(moves);
		moves.forEach((m, i) => {
			this.context.baseMove = m;
			score = this.alphaBeta(m, this.config.depth - 1, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, false);
			if (score === bestMoveScore) {
				bestMoves.push(m);
			} else if (score > bestMoveScore) {
				bestMoves = [m];
				bestMoveScore = score;
			}
			this.onProgress((i + 1) / moves.length, '');
		});
		this.context.positionScores = {};
		this.notifyMove(bestMoves[Math.trunc(Math.random() * bestMoves.length)].name);
		return;
	}
}
