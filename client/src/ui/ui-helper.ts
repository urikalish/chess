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

	static getRandomName(isMale: boolean) {
		// prettier-ignore
		const maleNames = ['Aaron', 'Adam', 'Alan', 'Albert', 'Alexander', 'Andrew', 'Anthony', 'Arthur', 'Austin', 'Benjamin', 'Billy', 'Bobby', 'Brandon', 'Brian', 'Bruce', 'Bryan', 'Carl', 'Charles', 'Christian', 'Christopher', 'Daniel', 'David', 'Dennis', 'Donald', 'Douglas', 'Dylan', 'Edward', 'Elijah', 'Eric', 'Ethan', 'Eugene', 'Frank', 'Gabriel', 'Gary', 'George', 'Gerald', 'Gregory', 'Harold', 'Henry', 'Jack', 'Jacob', 'James', 'Jason', 'Jeffrey', 'Jeremy', 'Jerry', 'Jesse', 'Joe', 'John', 'Jonathan', 'Jordan', 'Jose', 'Joseph', 'Joshua', 'Juan', 'Justin', 'Keith', 'Kenneth', 'Kevin', 'Kyle', 'Larry', 'Lawrence', 'Logan', 'Louis', 'Mark', 'Mason', 'Matthew', 'Michael', 'Nathan', 'Nicholas', 'Noah', 'Patrick', 'Paul', 'Peter', 'Philip', 'Ralph', 'Randy', 'Raymond', 'Richard', 'Robert', 'Roger', 'Ronald', 'Roy', 'Russell', 'Ryan', 'Samuel', 'Scott', 'Sean', 'Stephen', 'Steven', 'Terry', 'Thomas', 'Timothy', 'Tyler', 'Vincent', 'Walter', 'Wayne', 'William', 'Willie', 'Zachary'];
		// prettier-ignore
		const femaleNames = ['Abigail', 'Alexis', 'Alice', 'Amanda', 'Amber', 'Amy', 'Andrea', 'Angela', 'Ann', 'Anna', 'Ashley', 'Barbara', 'Betty', 'Beverly', 'Brenda', 'Brittany', 'Carol', 'Carolyn', 'Catherine', 'Charlotte', 'Cheryl', 'Christina', 'Christine', 'Cynthia', 'Danielle', 'Deborah', 'Debra', 'Denise', 'Diana', 'Diane', 'Donna', 'Doris', 'Dorothy', 'Elizabeth', 'Emily', 'Emma', 'Evelyn', 'Frances', 'Gloria', 'Grace', 'Hannah', 'Heather', 'Helen', 'Isabella', 'Jacqueline', 'Janet', 'Janice', 'Jean', 'Jennifer', 'Jessica', 'Joan', 'Joyce', 'Judith', 'Judy', 'Julia', 'Julie', 'Karen', 'Katherine', 'Kathleen', 'Kathryn', 'Kayla', 'Kelly', 'Kimberly', 'Laura', 'Lauren', 'Linda', 'Lisa', 'Lori', 'Madison', 'Margaret', 'Maria', 'Marie', 'Marilyn', 'Martha', 'Mary', 'Megan', 'Melissa', 'Michelle', 'Nancy', 'Natalie', 'Nicole', 'Olivia', 'Pamela', 'Patricia', 'Rachel', 'Rebecca', 'Ruth', 'Samantha', 'Sandra', 'Sara', 'Sarah', 'Sharon', 'Shirley', 'Sophia', 'Stephanie', 'Susan', 'Teresa', 'Theresa', 'Victoria', 'Virginia'];
		return isMale ? maleNames[Math.random() * maleNames.length] : femaleNames[Math.random() * femaleNames.length];
	}
}
