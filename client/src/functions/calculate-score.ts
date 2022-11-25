import { PieceType } from '../model/piece';

const pieceWorth = {
	[PieceType.PAWN]: 1,
	[PieceType.KNIGHT]: 3.05,
	[PieceType.BISHOP]: 3.33,
	[PieceType.ROOK]: 5.63,
	[PieceType.QUEEN]: 9.5,
};

export function calculateScore(
	score: number,
	pieceCount: {
		p: number;
		n: number;
		b: number;
		r: number;
		q: number;
	}[],
	myIndex: number,
	enemyIndex: number,
): number {
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
