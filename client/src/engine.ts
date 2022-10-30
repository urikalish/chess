import { Move } from './move';
import { Position } from './position';
import { MoveType } from './types';

export class Engine {
	getAllPossibleMoves(position: Position): Move[] {
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
			moves.push(...this.getAllPossibleMovesForPiece(position, i));
		}
		return moves;
	}

	getAllPossibleMovesForPiece(position: Position, index: number): Move[] {
		const moves: Move[] = [];
		moves.push(new Move(position.fullMoveNumber, position.activeArmyIndex, index, index - 8, MoveType.NORMAL));
		moves.push(new Move(position.fullMoveNumber, position.activeArmyIndex, index, index + 8, MoveType.NORMAL));
		return moves;
	}
}
