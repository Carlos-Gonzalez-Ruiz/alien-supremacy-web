/**
  * Módulo para la sección de configuración de jugador del menú del juego.
  */

import * as domUi from '/js/dom-ui/dom-ui.js';

import * as game from '/js/game/game.js';
import * as audio from '/js/game/audio.js';

import * as gameMenuUi from '/js/game/game-menu-ui.js';

/** Lista de elementos. */
let elements = [];
/** Caja de configuración de jugador. */
let playerSettingsBox;

/**
  * Función de inicialización del módulo.
  */
export function init() {
	initDomUi();
}

/**
  * Función de inicialización de domUi.
  */
function initDomUi() {
	// Caja de configuración de jugador.
	playerSettingsBox = domUi.createScrollableElement(`
		<div style="margin: 4em; width: calc(100vw - (4em * 2.5)); height: calc(100vh - (4em * 2.5));">
			<div style="display: flex;">
				<div style="flex: 1; max-width: fit-content; margin: 1em">
					<button data-title="Go back to the menu" class="game go-back"><i class="bi bi-arrow-left"></i></button>
				</div>
				<div style="flex: 1;">
					<div class="box" style="text-align: center;">
						<div class="box-title-simple">
							<h2><i class="bi bi-gear-fill"></i> Player settings</h2>
						</div>
						<div class="box-description">
							<p>Player settings placeholder text.</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	`);
	playerSettingsBox.querySelector('button.go-back').onclick = function() {
		gameMenuUi.displayMainMenuBox();
		gameMenuUi.displayRefreshButtonBox();
		gameMenuUi.displayGalaxyNameBox();
		hidePlayerSettingsBox();
		
		// Reproducir sonido.
		audio.soundClick2.play();
	};
	elements.push(playerSettingsBox);
}

/**
  * Función de bucle del módulo.
  */
export function update() {

}

/**
  * Función para refactorizar el mostrar playerSettingsBox.
  */
export function displayPlayerSettingsBox() {
	domUi.displayElement(playerSettingsBox, 0 + 'px', 0 + 'px', 5);
	domUi.setAnimation(playerSettingsBox, 'fadeInRight', gameMenuUi.MENU_SECTION_ANIMATION_TIME_START + 's');
}

/**
  * Función para refactorizar el dejar de mostrar playerSettingsBox.
  */
export function hidePlayerSettingsBox() {
	let time = gameMenuUi.MENU_SECTION_ANIMATION_TIME_END; // Tiempo en segundos.
	
	domUi.setAnimation(playerSettingsBox, 'fadeOutRight', time + 's');
	domUi.hideElement(playerSettingsBox, time); // Esconder tras un tiempo.
}

