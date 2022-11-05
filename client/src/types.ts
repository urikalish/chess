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
	GAME_PHASE = 'msg-game-phase',
	MOVE = 'msg-move',
}

export enum MoveType {
	NA = '-',
	NORMAL = 'normal',
	CAPTURE = 'capture',
	PAWN_DOUBLE_START = 'pawn-double-start',
	PROMOTION = 'promotion',
	PROMOTION_TO_Q = 'promotion-to-q',
	PROMOTION_TO_R = 'promotion-to-r',
	PROMOTION_TO_B = 'promotion-to-b',
	PROMOTION_TO_N = 'promotion-to-n',
	EN_PASSANT = 'en-passant',
	KS_CASTLE = 'ks-castle',
	QS_CASTLE = 'qs-castle',
}
