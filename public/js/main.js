import {Settings} from "./settings.js";
import {Game} from "./game.js";
import {UIHelper} from "./ui-helper.js";
import {Welcome} from "./welcome.js";

let game = null;

function handleGameUpdate(game) {
	UIHelper.placePieces(game.board);
}

function handleStartGame(fenStr, isWhite) {
	Settings.isInteractive = true;
	Settings.isPlayerWhite = isWhite;
	Settings.isFlippedBoard = Settings.isInteractive && !isWhite;
	game = new Game();
	UIHelper.createGameUI();
	game.start(fenStr, handleGameUpdate);
}

function handleWelcomeDone(fenStr, isWhite) {
	handleStartGame(fenStr, isWhite);
}

function init() {
	Welcome.init(handleWelcomeDone);
}

init();
