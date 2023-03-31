/**
  * Módulo de interfaz de usuario DOM de control de galaxia.
  */

import * as domUi from '/js/dom-ui/dom-ui.js';

import * as gameConstants from '/js/constants/game-constants.js';

import * as graphics from '/js/graphics/graphics.js';

import * as game from '/js/game/game.js';

import * as galaxy from '/js/game/scene/galaxy.js';
import * as galaxyControl from '/js/game/scene/galaxy-control.js';

/** Lista de elementos. */
let elements = [];
/** Caja para ver estrella. */
let starHoveredBox;
/** Caja para viajar a estrella. */
let starSelectedBox;

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
	// Caja para ver estrella.
	starHoveredBox = domUi.createElement(`
		<div
		 style="
			border: 2px solid blue;
			border-radius: 5px;
			background-color: darkblue;
			padding: 0px 10px;
		">
			<p style="color: white;">
				<span class="star-name">Star name</span>
			</p>
		</div>
	`);
	elements.push(starHoveredBox);
	
	// Caja para viajar a estrella.
	starSelectedBox = domUi.createElement(`
		<div
		 style="
			top: 132px;
			display: inline-block;
			
			border: 2px solid blue;
			border-radius: 5px;
			background-color: darkblue;
			padding: 0px 10px;
		">
			<p style="color: white;">
				<span class="star-name">Star name</span>
				<button class="goto-star">Go</button>
			</p>
		</div>
	`);
	elements.push(starSelectedBox);
	starSelectedBox.querySelector("button.goto-star").onclick = function() {
		game.gotoStarSystemSave(galaxy.starData[galaxyControl.selectedArm][galaxyControl.selectedStar]);
	}
}

/**
  * Función de bucle del módulo.
  */
export function update() {
	// Comprobrar que esté al nivel.
	if (game.viewLevel == gameConstants.VIEW_LEVEL_GALAXY) {
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
  * Función para refactorizar el mostrado starHoveredBox.
  */
export function displayStarHoveredBox() {
	let coords = graphics.realCoordsToScreenCoords(galaxy.view.camera, galaxyControl.hoverStarMesh.position);
	let elementHeight = domUi.getHeight(starHoveredBox);
	
	domUi.displayElement(
		starHoveredBox,
		coords.x + 32 + 'px',
		(coords.y - elementHeight / 2) + 'px',
		10
	);
}

/**
  * Función para refactorizar el dejar de mostrar starSelectedBox.
  */
export function hideStarHoveredBox() {
	domUi.hideElement(starHoveredBox);
}

/**
  * Función para refactorizar el mostrar starSelectedBox.
  */
export function displayStarSelectedBox() {
	let coords = graphics.realCoordsToScreenCoords(galaxy.view.camera, galaxyControl.selectedStarMesh.position);
	let elementHeight = domUi.getHeight(starHoveredBox);
	
	domUi.displayElement(
		starSelectedBox,
		coords.x + 32 + 'px',
		(coords.y - elementHeight / 2) + 'px',
		9
	);
}

/**
  * Función para refactorizar el dejar de mostrar starSelectedBox.
  */
export function hideStarSelectedBox() {
	domUi.hideElement(starSelectedBox);
}

/**
  * Callback de actualización cuando la cámara sea actualizada.
  */
export function cameraOnUpdate() {
	// Solo actualizar si se ha de mostrar la UI.
	//if (displayUi) {
		// Actualizar hover.
		if (galaxyControl.hoveredStar != -1) {
			displayStarHoveredBox();
		}

		// Actualiar selected.
		if (galaxyControl.selectedStar != -1) {
			displayStarSelectedBox();
		}
	//}
}
