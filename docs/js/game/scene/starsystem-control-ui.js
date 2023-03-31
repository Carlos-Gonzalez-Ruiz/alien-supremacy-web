/**
  * Módulo de interfaz de usuario DOM de control de galaxia.
  */

import * as domUi from './js/dom-ui/dom-ui.js';

import * as gameConstants from './js/constants/game-constants.js';

import * as game from './js/game/game.js';

import * as starSytem from './js/game/scene/starsystem.js';
import * as starSystemControl from './js/game/scene/starsystem-control.js';

/** Lista de elementos. */
let elements = [];
/** Caja para volver a galaxia. */
let goBackBox;

/** Indicar si se debe mostrar la UI (cuando sea su nivel) */
let displayUi = false;

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
	// Caja para volver a galaxia.
	goBackBox = domUi.createElement(`
		<div
		 style="
			border: 2px solid blue;
			border-radius: 5px;
			background-color: darkblue;
			padding: 0px 10px;
		">
			<p style="color: white;">
				<button class="goto-galaxy">Go to galaxy</button>
				<button class="goto-back">←</button>
				<button class="goto-next">→</button>
			</p>
		</div>
	`);
	goBackBox.querySelector("button.goto-galaxy").onclick = function() {
		game.gotoGalaxy();
	}
	goBackBox.querySelector("button.goto-back").onclick = function() {
		starSystemControl.goPrevStar();
	}
	goBackBox.querySelector("button.goto-next").onclick = function() {
		starSystemControl.goNextStar();
	}
	elements.push(goBackBox);
}

/**
  * Función de bucle del módulo.
  */
export function update() {
	// Comprobrar que esté al nivel.
	if (game.viewLevel == gameConstants.VIEW_LEVEL_STARSYSTEM) {
		if (!displayUi) {
			displayUi = true;
			
			// Simplemente actualizando la UI, se muestra lo justo y necesario.
			cameraOnUpdate();
		}
	} else {
		if (displayUi) {
			displayUi = false;
			
			// Esconder todos los elementos.
			for (let i = 0; i < elements.length; ++i) {
				domUi.hideElement(elements[i]);
			}
		}
	}
}

/**
  * Función para refactorizar el mostrar goBackBox.
  */
export function displayGoBackBox() {
	domUi.displayElement(goBackBox);
}

/**
  * Callback de actualización cuando la cámara sea actualizada.
  */
export function cameraOnUpdate() {
	// Solo actualizar si se ha de mostrar la UI.
	if (displayUi) {
		// Actualizar goBackBox.
		displayGoBackBox();
	}
}
