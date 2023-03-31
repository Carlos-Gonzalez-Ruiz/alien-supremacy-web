/**
  * Módulo main de la aplicación.
  */

import * as domUi from '/proyecto-fin-ciclo/js/dom-ui/dom-ui.js';
import * as graphics from '/proyecto-fin-ciclo/js/graphics/graphics.js';
import * as keyboard from '/proyecto-fin-ciclo/js/keyboard/keyboard.js';
import * as game from '/proyecto-fin-ciclo/js/game/game.js';

/**
  * Función de inicialización del main.
  */
export function init() {
	domUi.init();
	graphics.init();
	keyboard.init();
	game.init();
}

/**
  * Función de bucle del main.
  */
export function updateLoop() {
	requestAnimationFrame(updateLoop);
	
	domUi.update();
	graphics.render();
	game.update();
	keyboard.keyProcessing();
}
