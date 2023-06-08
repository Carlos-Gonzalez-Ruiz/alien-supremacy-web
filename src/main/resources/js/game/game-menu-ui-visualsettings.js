/**
  * Módulo para la sección de configuración de gráficos del menú del juego.
  */

import * as domUi from '/js/dom-ui/dom-ui.js';

import * as game from '/js/game/game.js';
import * as audio from '/js/game/audio.js';

import * as gameMenuUi from '/js/game/game-menu-ui.js';

/** Lista de elementos. */
let elements = [];
/** Caja de configuración de visualización. */
let visualSettingsBox;

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
	// Caja de configuración de visualización.
	visualSettingsBox = domUi.createScrollableElement(`
		<div style="margin: 4em; width: calc(100vw - (4em * 2.5)); height: calc(100vh - (4em * 2.5));">
			<div style="display: flex;">
				<div style="flex: 1; max-width: fit-content; margin: 1em">
					<button data-title="Go back to the menu" class="game go-back"><i class="bi bi-arrow-left"></i></button>
				</div>
				<div style="flex: 1;">
					<div class="box" style="text-align: center;">
						<div class="box-title-simple">
							<h2><i class="bi bi-gear-fill"></i> Visual settings</h2>
						</div>
						<div class="box-description">
							<p>Visual settings placeholder text.</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	`);
	visualSettingsBox.querySelector('button.go-back').onclick = function() {
		gameMenuUi.displayMainMenuBox();
		gameMenuUi.displayRefreshButtonBox();
		gameMenuUi.displayGalaxyNameBox();
		hideVisualSettingsBox();
		
		// Reproducir sonido.
		audio.soundClick2.play();
	};
	elements.push(visualSettingsBox);
}

/**
  * Función de bucle del módulo.
  */
export function update() {

}

/**
  * Función para refactorizar el mostrar visualSettingsBox.
  */
export function displayVisualSettingsBox() {
	domUi.displayElement(visualSettingsBox, 0 + 'px', 0 + 'px', 5);
	domUi.setAnimation(visualSettingsBox, 'fadeInRight', gameMenuUi.MENU_SECTION_ANIMATION_TIME_START + 's');
}

/**
  * Función para refactorizar el dejar de mostrar visualSettingsBox.
  */
export function hideVisualSettingsBox() {
	let time = gameMenuUi.MENU_SECTION_ANIMATION_TIME_END; // Tiempo en segundos.
	
	domUi.setAnimation(visualSettingsBox, 'fadeOutRight', time + 's');
	domUi.hideElement(visualSettingsBox, time); // Esconder tras un tiempo.
}

