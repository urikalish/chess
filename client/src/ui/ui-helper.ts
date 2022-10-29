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

	static queryNameElm(name: string): HTMLElement | null {
		return document.querySelector(`[data-name="${name}"]`);
	}
}
