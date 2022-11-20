import { Fen } from './fen';
import { PieceColor, PieceType, Piece } from './piece';
import { Army } from './army';
import { Position } from './position';
import { Board } from './board';
import { MoveType, Move } from './move';
import { Mover } from './mover';
import { Player, PlayerGenderType, PlayerType } from './player';
import { Bot } from '../bots/bot';

export enum GameResult {
	WIN = 'win',
	WIN_BY_WHITE = 'checkmate-by-white',
	WIN_BY_BLACK = 'checkmate-by-black',
	CHECKMATE = 'checkmate',
	DRAW = 'draw',
	STALEMATE = 'stalemate',
	THREEFOLD_REPETITION = 'threefold-repetition',
	FIVEFOLD_REPETITION = 'fivefold-repetition',
	FIFTY_MOVES = 'fifty-moves',
	SEVENTY_FIVE_MOVES = 'seventy-five-moves',
	INSUFFICIENT_MATERIAL = 'insufficient-material',
	INVALID_POSITION = 'invalid-position',

	WHITE_RESIGNATION = 'white-resignation',
	BLACK_RESIGNATION = 'black-resignation',
	MUTUAL_AGREEMENT = 'mutual-agreement',
}

export class Game {
	players: Player[];
	armies: Army[];
	board: Board;
	positions: Position[] = [];
	moves: Move[] = [];
	possibleMoves: Move[] = [];
	startTime = 0;
	mover = new Mover();
	results: Set<GameResult> = new Set();
	resultStr = '';

	constructor(
		player0Type: PlayerType,
		player0Gender: PlayerGenderType,
		player0Name: string,
		player1Type: PlayerType,
		player1Gender: PlayerGenderType,
		player1Name: string,
		fenStr: string,
	) {
		this.players = [new Player(0, player0Type, player0Gender, player0Name), new Player(1, player1Type, player1Gender, player1Name)];
		this.armies = [new Army(0, player0Type), new Army(1, player1Type)];
		this.board = new Board();
		this.applyFen(fenStr);
	}

	startGame(startTime: number) {
		this.startTime = startTime;
	}

	getCurPosition(): Position | null {
		return this.positions.length ? this.positions[this.positions.length - 1] : null;
	}

	getCurMove(): Move | null {
		return this.moves.length ? this.moves[this.moves.length - 1] : null;
	}

	getCurPlayer(): Player | null {
		const p = this.getCurPosition();
		return p ? this.players[p.armyIndex] : null;
	}

	pushMove(m: Move) {
		//console.log(m.name);
		this.moves.push(m);
	}

	isEnded(): boolean {
		return this.results.size > 0;
	}

	endGame(gameResults: GameResult[], resultStr: string) {
		gameResults.forEach(gameResult => {
			this.results.add(gameResult);
		});
		this.resultStr = resultStr;
		//console.log(resultStr);
	}

	checkForGameEnded() {
		//no possible moves
		if (this.possibleMoves.length === 0) {
			const m = this.getCurMove();
			if (!m) {
				return;
			}
			if (m.types.has(MoveType.CHECKMATE)) {
				//checkmate
				if (m.armyIndex === 0) {
					this.endGame([GameResult.WIN, GameResult.WIN_BY_WHITE, GameResult.CHECKMATE], '1-0 (checkmate by white)');
					return;
				} else {
					this.endGame([GameResult.WIN, GameResult.WIN_BY_BLACK, GameResult.CHECKMATE], '0-1 (checkmate by black)');
					return;
				}
			}
			//stalemate
			this.endGame([GameResult.DRAW, GameResult.STALEMATE], '½-½ (stalemate)');
			return;
		}

		//fifty moves
		const p = this.getCurPosition();
		if (p && p.halfMoveClock === 100) {
			this.endGame([GameResult.DRAW, GameResult.FIFTY_MOVES], '½-½ (fifty moves)');
			return;
		}

		//threefold repetition
		if (this.positions.length >= 8) {
			const ps = {};
			for (let i = this.positions.length - 1; i >= 0; i--) {
				const str = Fen.getFenStr(this.positions[i], true, true, true, false, false);
				if (!ps[str]) {
					ps[str] = 1;
				} else {
					ps[str]++;
					if (ps[str] === 3) {
						this.endGame([GameResult.DRAW, GameResult.THREEFOLD_REPETITION], '½-½ (threefold repetition)');
						return;
					}
				}
			}
		}

		//insufficient material
		if (
			this.board.onlyKingsLeft() ||
			this.board.onlyOnePieceLeft(PieceType.BISHOP) ||
			this.board.onlyOnePieceLeft(PieceType.KNIGHT) ||
			this.board.onlyTwoSameColorBishopsLeft()
		) {
			this.endGame([GameResult.DRAW, GameResult.INSUFFICIENT_MATERIAL], '½-½ (insufficient material)');
			return;
		}
	}

	pushPosition(p: Position) {
		//console.log(Fen.getFenStr(p));
		this.positions.push(p);
		//const startTime = Date.now();
		this.possibleMoves = this.mover.getAllPossibleMoves(p);
		this.checkForGameEnded();
		//console.log(`${Date.now() - startTime}ms`);
	}

	applyFen(fenStr: string) {
		const p = Fen.parseFenStr(fenStr);
		if (!Position.assureTwoKings(p)) {
			this.results.add(GameResult.INVALID_POSITION);
			//console.log('Missing some kings...');
			alert('Missing some kings...');
		}
		Position.prohibitCastingBasedOnPiecePosition(p);
		for (let i = 0; i < 64; i++) {
			const char = p.pieceData[i];
			if (!char) {
				continue;
			}
			const color = char === char.toUpperCase() ? PieceColor.WHITE : PieceColor.BLACK;
			const armyIndex = color === PieceColor.WHITE ? 0 : 1;
			const piece = this.armies[armyIndex].createAndAddPiece(char.toLowerCase() as PieceType);
			this.board.placePiece(piece, i);
		}
		this.pushPosition(p);
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
			if (m.types.has(MoveType.PROMOTION_TO_Q)) {
				Piece.promote(piece, PieceType.QUEEN);
			} else if (m.types.has(MoveType.PROMOTION_TO_R)) {
				Piece.promote(piece, PieceType.ROOK);
			} else if (m.types.has(MoveType.PROMOTION_TO_B)) {
				Piece.promote(piece, PieceType.BISHOP);
			} else if (m.types.has(MoveType.PROMOTION_TO_N)) {
				Piece.promote(piece, PieceType.KNIGHT);
			}
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

	isBotTurn() {
		const p = this.getCurPosition();
		return p && !this.isEnded() && this.armies[p.armyIndex].playerType === PlayerType.BOT;
	}

	isHumanTurn() {
		const p = this.getCurPosition();
		return p && !this.isEnded() && this.armies[p.armyIndex].playerType === PlayerType.HUMAN;
	}

	getBotMove(): Move | null {
		const p = this.getCurPosition();
		const playerName = this.getCurPlayer()?.name || '';
		if (!p || !playerName) {
			return null;
		}
		return Bot.getBotMove(playerName, p);
	}
}
