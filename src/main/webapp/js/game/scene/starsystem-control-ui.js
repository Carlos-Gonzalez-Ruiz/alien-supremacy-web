/**
  * Módulo de interfaz de usuario DOM de control de galaxia.
  */

import * as domUi from '/js/dom-ui/dom-ui.js';

import * as gameConstants from '/js/constants/game-constants.js';

import * as graphics from '/js/graphics/graphics.js';

import * as game from '/js/game/game.js';
import * as gameControl from '/js/game/game-control.js';

import * as starSystem from '/js/game/scene/starsystem.js';
import * as starSystemControl from '/js/game/scene/starsystem-control.js';

/** Lista de elementos. */
let elements = [];
/** Caja para volver a galaxia. */
let goBackBox;
/** Caja para ver planeta. */
let planetHoveredBox;
/** Caja para ver detalles planeta. */
let planetSelectedBox;

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
		<div class="box">
			<div style="color: white;">
				<button class="game goto-galaxy">Go to galaxy</button>
				<button class="game goto-back">←</button>
				<button class="game goto-next">→</button>
			</div>
		</div>
	`);
	goBackBox.querySelector('button.goto-galaxy').onclick = function() {
		game.gotoGalaxy();
	}
	goBackBox.querySelector('button.goto-back').onclick = function() {
		starSystemControl.goPrevStar();
	}
	goBackBox.querySelector('button.goto-next').onclick = function() {
		starSystemControl.goNextStar();
	}
	elements.push(goBackBox);
	
	// Caja para ver planeta.
	planetHoveredBox = domUi.createElement(`
		<div class="box-arrow">
			<div style="color: white;">
				<span class="box-title planet-name">Planet name</span>
			</div>
		</div>
	`);
	elements.push(planetHoveredBox);
	
	// Caja para viajar a planet.
	planetSelectedBox = domUi.createElement(`
		<div class="box-arrow">
			<div style="color: white;">
				<span class="box-title planet-name">Planet name</span>
				<br>
				<button class="game colonize-planet">Colonize</button>
				<br>
				<button class="game build-combat-ship">Build combat ship</button>
			</div>
		</div>
	`);
	elements.push(planetSelectedBox);
	planetSelectedBox.querySelector('button.colonize-planet').onclick = function() {
		console.log('colonize planet');
	}
	planetSelectedBox.querySelector('button.build-combat-ship').onclick = function() {
		if (starSystemControl.selectedPlanet >= starSystem.planetData.length) {
			alert('cannot build combat ships in stars yet!');
		} else {
			gameControl.createCombatShip(starSystem.currentStar, starSystem.planetData[starSystemControl.selectedPlanet]);
		}
	}
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
	domUi.displayElement(goBackBox, 0, 0, 8);
}

/**
  * Función para refactorizar el mostrado planetHoveredBox.
  */
export function displayPlanetHoveredBox() {
	let coords = graphics.realCoordsToScreenCoords(starSystem.view.camera, starSystemControl.hoverPlanetMesh.position);
	let elementHeight = domUi.getHeight(planetHoveredBox);
	
	domUi.displayElement(
		planetHoveredBox,
		coords.x + 32 + 'px',
		(coords.y - elementHeight / 2) + 'px',
		10
	);
}

/**
  * Función para refactorizar el dejar de mostrar planetHoveredBox.
  */
export function hidePlanetHoveredBox() {
	domUi.hideElement(planetHoveredBox);
}

/**
  * Función para refactorizar el mostrar planetSelectedBox.
  */
export function displayPlanetSelectedBox() {
	let coords = graphics.realCoordsToScreenCoords(starSystem.view.camera, starSystemControl.selectedPlanetMesh.position);
	let elementHeight = domUi.getHeight(planetHoveredBox);
	
	domUi.displayElement(
		planetSelectedBox,
		coords.x + 32 + 'px',
		(coords.y - elementHeight / 2) + 'px',
		9
	);
}

/**
  * Función para refactorizar el dejar de mostrar planetSelectedBox.
  */
export function hidePlanetSelectedBox() {
	domUi.hideElement(planetSelectedBox);
}

/**
  * Callback de actualización cuando la cámara sea actualizada.
  */
export function cameraOnUpdate() {
	// Solo actualizar si se ha de mostrar la UI.
	if (displayUi) {
		// Actualizar goBackBox.
		displayGoBackBox();
		
		// Actualizar hover.
		if (starSystemControl.hoveredPlanet != -1) {
			displayPlanetHoveredBox();
		}

		// Actualiar selected.
		if (starSystemControl.selectedPlanet != -1) {
			displayPlanetSelectedBox();
		}
	}
}
