export class UiHelper {
	static getElm(id: string): HTMLElement | null {
		return document.getElementById(id);
	}

	static queryElm(selectors) {
		return document.querySelector(selectors);
	}

	static queryElms(selectors) {
		return document.querySelectorAll(selectors);
	}

	static queryIndexElm(index: number): HTMLElement | null {
		return document.querySelector(`[data-index="${index}"]`);
	}

	static queryUiIndexElm(uiIndex: number): HTMLElement | null {
		return document.querySelector(`[data-ui-index="${uiIndex}"]`);
	}

	static querySquareIndexElm(squareIndex: number): HTMLElement | null {
		return document.querySelector(`[data-square-index="${squareIndex}"]`);
	}

	static queryNameElm(name: string): HTMLElement | null {
		return document.querySelector(`[data-name="${name}"]`);
	}

	static getModifiedIndex(index: number, isBoardFlipped: boolean) {
		return isBoardFlipped ? 63 - index : index;
	}

	static isElmVisible(elm, container = document.body) {
		const { top, bottom, height } = elm.getBoundingClientRect();
		const holderRect = container.getBoundingClientRect();
		return top <= holderRect.top ? holderRect.top - top <= height : bottom - holderRect.bottom <= height;
	}
}
