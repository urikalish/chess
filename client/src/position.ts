import { ColorType } from './types.js';

export class Position {
	pieceData: string[] = [];
	activeColor: ColorType = ColorType.WHITE;
	fullMoveNumber = 1;

	constructor(activeColor: ColorType, fullMoveNumber: number) {
		this.pieceData = [];
		this.activeColor = activeColor;
		this.fullMoveNumber = fullMoveNumber;
	}
}
