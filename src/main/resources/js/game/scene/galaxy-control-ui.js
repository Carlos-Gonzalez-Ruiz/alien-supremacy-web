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
export let starHoveredBox;
/** Caja para viajar a estrella. */
export let starSelectedBox;

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
		<div class="box-arrow">
			<span class="box-title">
				<i class="bi bi-stars"></i>
				<span class="star-name"></span>
			</span>
		</div>
	`);
	elements.push(starHoveredBox);
	
	// Caja para viajar a estrella.
	starSelectedBox = domUi.createElement(`
		<div class="box-arrow" style="width: 100%;">
			<div style="display: flex; align-items: center">
				<div style="flex: 1; flex-grow: 2; padding-right: 10px;">
					<span class="box-title">
						<i class="bi bi-stars"></i>
						<span class="star-name"></span>
					</span>
				</div>
				<div style="flex: 1; text-align: right;">
					<button class="game goto-star"><i class="bi bi-arrow-up-right"></i></button>
				</div>
			</div>
			<hr>
			<div class="star-planets box-content">
				<div style="color: #F77"><i class="bi bi-globe2"></i> Planet 1</div>
				<div style="color: #7F7"><i class="bi bi-globe2"></i> Planet 2</div>
				<div style="color: #77F"><i class="bi bi-globe2"></i> Planet 3</div>
				<div style="color: #77F"><i class="bi bi-globe2"></i> Planet 4</div>
			</div>
		</div>
	`);
	elements.push(starSelectedBox);
	starSelectedBox.querySelector('button.goto-star').onclick = function() {
		game.gotoStarSystemSave(galaxyControl.generateStarData(galaxyControl.selectedArm, galaxyControl.selectedStar));
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
		(Math.round(coords.x) + 32) + 'px',
		Math.round(coords.y) + 'px',
		10
	);
	domUi.setAnimation(starHoveredBox, 'fadeInRight', '0.2s');
}

/**
  * Función para refactorizar el dejar de mostrar starHoveredBox.
  */
export function hideStarHoveredBox() {
	domUi.setAnimation(starHoveredBox, 'fadeOutRight', '0.2s');
	domUi.hideElement(starHoveredBox, 0.2);
}

/**
  * Función para refactorizar el mostrar starSelectedBox.
  */
export function displayStarSelectedBox() {
	let coords = graphics.realCoordsToScreenCoords(galaxy.view.camera, galaxyControl.selectedStarMesh.position);
	let elementHeight = domUi.getHeight(starHoveredBox);
	
	domUi.displayElement(
		starSelectedBox,
		(Math.round(coords.x) + 32) + 'px',
		Math.round(coords.y) + 'px',
		9
	);
	domUi.setAnimation(starSelectedBox, 'fadeInRight', '0.2s');
}

/**
  * Función para refactorizar el dejar de mostrar starSelectedBox.
  */
export function hideStarSelectedBox() {
	domUi.setAnimation(starSelectedBox, 'fadeOutRight', '0.2s');
	domUi.hideElement(starSelectedBox, 0.2);
}

/**
  * Callback de actualización cuando la cámara sea actualizada.
  */
export function cameraOnUpdate() {
	// Solo actualizar si se ha de mostrar la UI.
	if (displayUi) {
		// Actualizar hover.
		if (galaxyControl.hoveredStar != -1) {
			displayStarHoveredBox();
		}

		// Actualiar selected.
		if (galaxyControl.selectedStar != -1) {
			displayStarSelectedBox();
		}
	}
}
