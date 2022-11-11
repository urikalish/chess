export enum PlayerType {
	HUMAN = 'human',
	BOT = 'bot',
}

export enum PlayerGenderType {
	NA = '-',
	MALE = 'male',
	FEMALE = 'female',
}

export enum ColorType {
	WHITE = 'white',
	BLACK = 'black',
}

export enum SquareColor {
	LIGHT = 'light',
	DARK = 'dark',
}

export enum PieceType {
	PAWN = 'p',
	KNIGHT = 'n',
	BISHOP = 'b',
	ROOK = 'r',
	QUEEN = 'q',
	KING = 'k',
}

export enum PieceTypeCased {
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
	CASTLING = 'castling',
	CASTLING_KS = 'castling-ks',
	CASTLING_QS = 'castling-qs',
	CHECK = 'check',
	CHECKMATE = 'checkmate',
}

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

	WHITE_RESIGNATION = 'white-resignation',
	BLACK_RESIGNATION = 'black-resignation',
	MUTUAL_AGREEMENT = 'mutual-agreement',
}
