import { ColorType } from './types.js';

export class Position {
	pieceData: string[] = [];
	activeColor: ColorType = ColorType.WHITE;
	fullMoveNumber = 1;
}
