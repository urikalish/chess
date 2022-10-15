import {PlayerType} from "./types.js";
import {Player} from "./player.js";
import {Game} from "./game.js";
import {UIHelper} from "./ui-helper.js";
import {Welcome} from "./welcome.js";

let game = null;

function handleGameUpdate(game) {
	UIHelper.placePieces(game.board);
}

function handleWelcomeDone(fenStr, playerName, isWhite) {
	const players = [
		new Player(0, PlayerType.HUMAN, playerName),
		new Player(1, PlayerType.COMPUTER, 'Computer'),
	];
	game = new Game(players);
	UIHelper.createGameUI(isWhite);
	game.start(fenStr, handleGameUpdate);
}

function init() {
	Welcome.init(handleWelcomeDone);
}

init();
