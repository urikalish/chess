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
	PAWN_DOUBLE_START = 'pawn-double_start',
	PROMOTION = 'promotion',
	PROMOTION_TO_QUEEN = 'promotion-to-queen',
	PROMOTION_TO_ROOK = 'promotion-to-rook',
	PROMOTION_TO_BISHOP = 'promotion-to-bishop',
	PROMOTION_TO_KNIGHT = 'promotion-to-knight',
	EN_PASSANT = 'en-passant',
	KS_CASTLE = 'ks-castle',
	QS_CASTLE = 'qs-castle',
}
