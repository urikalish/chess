import { Move } from './move';
import { Position } from './position';

export class Engine {
	static getAllPossibleMoves(position: Position): Move[] {
		const moves: Move[] = [];
		for (let i = 0; i < position.pieceData.length; i++) {
			const pd = position.pieceData[i];
			if (!pd) {
				continue;
			}
			const pieceColorIndex = pd === pd.toUpperCase() ? 0 : 1;
			if (pieceColorIndex !== position.activeArmyIndex) {
				continue;
			}
			moves.push(...Engine.getAllPossibleMovesForPiece(position, i));
		}
		return moves;
	}

	static getAllPossibleMovesForPiece(position: Position, index: number): Move[] {
		const moves: Move[] = [];
		moves.push(new Move(position.fullMoveNumber, position.activeArmyIndex, index, index - 8));
		moves.push(new Move(position.fullMoveNumber, position.activeArmyIndex, index, index + 8));
		return moves;
	}
}
