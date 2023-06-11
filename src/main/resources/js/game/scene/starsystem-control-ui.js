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
export let goBackBox;
/** Caja para ver planeta. */
export let planetHoveredBox;
/** Caja para ver detalles planeta. */
export let planetSelectedBox;

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
		<div class="star-title">
			<div style="display: inline; margin-left: 1em">
				<button class="game gray goto-galaxy" data-title="Go to galaxy">
					<i class="bi bi-arrow-up-left"></i>
				</button>
				<button class="game goto-back" data-title="Go to previous star system">
					<i class="bi bi-arrow-90deg-left"></i>
				</button>
				<button class="game goto-next" data-title="Go to next star system">
					<i class="bi bi-arrow-90deg-right"></i>
				</button>
			</div>
			
			<h1 class="star-title unselectable"> <span class="muted">(unclaimed)</span></h1>
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
				<span class="box-title">
					<i class="planet-icon bi bi-globe"></i>
					<span class="planet-name"></span>
				</span>
			</div>
		</div>
	`);
	elements.push(planetHoveredBox);
	
	// Caja para viajar a planeta.
	planetSelectedBox = domUi.createElement(`
		<div class="box-arrow">
			<div style="color: white;">
				<span class="box-title">
					<!-- <i class="planet-icon bi bi-globe"></i> -->
					<i class="planet-icon bi bi-house-door-fill"></i>
					<span class="planet-name"></span>
				</span>
				<div style="text-align: center;">
					<div class="claimed-by-this-player-box">
						<hr>
						<div style="margin-bottom: 0.5em;">
							<button class="game add-building" data-title="Add buidling">
								<i class="bi bi-building-fill-add"></i>
							</button>
							<div class="box-content" style="display: inline;">
								<i class="bi bi-buildings-fill"></i>
								<i class="bi bi-buildings-fill"></i>
								<i class="bi bi-buildings-fill"></i>
								<i class="bi bi-buildings"></i>
								<i class="bi bi-buildings"></i>
							</div>
						</div>
						
						<button class="game colonize-planet" data-title="Build colonize ship">
							<i class="bi bi-rocket-fill"></i>
						</button>
						<button class="game build-combat-ship" data-title="Build combat ship">
							<i class="bi bi-airplane-engines-fill"></i>
						</button>
					</div>
					<div class="claimed-by-other-player-box" style="color: gray;">
						<hr>
						(<span class="claimed-by">unclaimed</span>)
					</div>
				</div>
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
		Math.round(coords.x + 32) + 'px',
		Math.round(coords.y) + 'px',
		10
	);
	domUi.setAnimation(planetHoveredBox, 'fadeInRight', '0.2s');
}

/**
  * Función para refactorizar el dejar de mostrar planetHoveredBox.
  */
export function hidePlanetHoveredBox() {
	domUi.setAnimation(planetHoveredBox, 'fadeOutRight', '0.2s');
	domUi.hideElement(planetHoveredBox, 0.2);
}

/**
  * Función para refactorizar el mostrar planetSelectedBox.
  */
export function displayPlanetSelectedBox() {
	let coords = graphics.realCoordsToScreenCoords(starSystem.view.camera, starSystemControl.selectedPlanetMesh.position);
	let elementHeight = domUi.getHeight(planetHoveredBox);
	
	domUi.displayElement(
		planetSelectedBox,
		Math.round(coords.x + 32) + 'px',
		Math.round(coords.y) + 'px',
		9
	);
	domUi.setAnimation(planetSelectedBox, 'fadeInRight', '0.2s');
}

/**
  * Función para refactorizar el dejar de mostrar planetSelectedBox.
  */
export function hidePlanetSelectedBox() {
	domUi.setAnimation(planetSelectedBox, 'fadeOutRight', '0.2s');
	domUi.hideElement(planetSelectedBox, 0.2);
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
