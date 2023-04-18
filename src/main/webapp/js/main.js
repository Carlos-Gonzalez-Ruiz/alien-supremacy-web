/**
  * Módulo main de la aplicación.
  */

import * as domUi from '/js/dom-ui/dom-ui.js';
import * as graphics from '/js/graphics/graphics.js';
import * as websocket from '/js/websocket/websocket.js';
import * as keyboard from '/js/keyboard/keyboard.js';
import * as game from '/js/game/game.js';
import * as gameMenuUi from '/js/game/game-menu-ui.js';

/**
  * Función de inicialización del main.
  */
export function init() {
	domUi.init();
	graphics.init();
	websocket.init();
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
	websocket.update();
	game.update();
	keyboard.keyProcessing();
}

/**
  * Función de carga de página.
  */
document.body.onload = function() {
	// Mostrar caja de pedir datos de usuario.
	gameMenuUi.displayLogInBox();
	gameMenuUi.hideLoadingBox();
}

/**
  * Función de salir de / entrar de pestaña.
  */
document.onvisibilitychange = function() {
	if (document.visibilityState === 'visible') {
		// Entrar en pestaña.
		Howler.volume(1);
	} else {
		// Salir de pestaña.
		Howler.volume(0);
	}
}
