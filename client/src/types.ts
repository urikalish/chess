export enum PlayerType {
	NA = '-',
	HUMAN = 'human',
	COMPUTER = 'computer',
}

export enum ColorType {
	NA = '-',
	WHITE = 'white',
	BLACK = 'black',
}

export enum PieceType {
	NA = '-',
	PAWN = 'p',
	KNIGHT = 'n',
	BISHOP = 'b',
	ROOK = 'r',
	QUEEN = 'q',
	KING = 'k',
}

export enum PieceTypeCased {
	NA = '-',
	WHITE_PAWN = 'P',
	WHITE_KNIGHT = 'N',
	WHITE_BISHOP = 'B',
	WHITE_ROOK = 'R',
	WHITE_QUEEN = 'Q',
	WHITE_KING = 'K',
	BLACK_PAWN = 'p',
	BLACK_KNIGHT = 'n',
	BLACK_BISHOP = 'b',
	BLACK_ROOK = 'r',
	BLACK_QUEEN = 'q',
	BLACK_KING = 'k',
}

export enum UserMsgType {
	REGULAR = 'msg-regular',
	GAME_PHASE = 'msg-game-phase',
	FEN_TEXT = 'msg-fen-text',
}
