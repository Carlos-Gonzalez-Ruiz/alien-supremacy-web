/**
  * Módulo de juego.
  * Este módulo se encarga de procesar cada instancia de la escena.
  */

import * as THREE from '/js/libs/three.module.js';

import * as gameConstants from '/js/constants/game-constants.js';

import * as graphics from '/js/graphics/graphics.js';

import * as audio from '/js/game/audio.js';
import * as line from '/js/game/line.js';

import * as gameControl from '/js/game/game-control.js';
import * as gameMenuUi from '/js/game/game-menu-ui.js';

import * as universe from '/js/game/scene/universe.js';
import * as galaxy from '/js/game/scene/galaxy.js';
import * as galaxyControl from '/js/game/scene/galaxy-control.js'
import * as galaxyControlUi from '/js/game/scene/galaxy-control-ui.js'
import * as starSystem from '/js/game/scene/starsystem.js';
import * as starSystemControl from '/js/game/scene/starsystem-control.js'
import * as starSystemControlUi from '/js/game/scene/starsystem-control-ui.js'

/** Indicar si está en menú principial. */
export let mainMenu;
/** Indicar si está en modo espectador. */
export let spectatorMode = false;

/** Nivel de vista. */
export let viewLevel = gameConstants.VIEW_LEVEL_GALAXY;

/** Aceleración de la gravedad. */
export let gravityAcc = 0.03;

/** Datos del usuario. */
export let user = {
	userId: -1,
	username: 'Guest'
};

/**
  * Función de inicialización del módulo.
  */
export function init() {
	// Iniciar juego.
	gameControl.init();
	gameMenuUi.init();
	
	// Iniciar universo.
	universe.init();
	// Iniciar galaxia.
	galaxy.init();
	// Iniciar sistema estelar.
	starSystem.init();
	
	// Iniciar sonido.
	audio.init();
	// Iniciar líneas.
	line.init(galaxy.view.scene);
	
	// Iniciar juego siempre en el menú.
	setMainMenu(true);
}

/**
  * Función de bucle del módulo.
  */
export function update() {
	gameControl.update();
	gameMenuUi.update();
	
	universe.update();
	galaxy.update();
	starSystem.update();
	
	line.update();
}

/**
  * Función para visualizar un sistema estelar, con registro de histórico.
  *
  * @param data datos de la estrella.
  */
export function gotoStarSystemSave(data) {
	galaxyControl.setVisitedStarsPos(galaxyControl.visitedStarsPos + 1);
	galaxyControl.visitedStars[galaxyControl.visitedStarsPos] = data;
	galaxyControl.visitedStars.splice(galaxyControl.visitedStarsPos + 1, galaxyControl.visitedStars.length - galaxyControl.visitedStarsPos);
	
	// Limitar histórico.
	if (galaxyControl.visitedStars.length > galaxyControl.visitedStarsCapacity) {
		galaxyControl.visitedStars.shift();
		galaxyControl.setVisitedStarsPos(galaxyControl.visitedStarsCapacity - 1);
		
		// Eliminar línea.
		line.remove(galaxyControl.visitedStarsLines[0]);
		galaxyControl.visitedStarsLines.shift();
		galaxyControl.visitedStarsLinesColors.shift();
	}
	
	// Eliminar color a líneas anteriores.
	for (let i = 0; i < galaxyControl.visitedStarsLinesColors.length; ++i) {
		galaxyControl.visitedStarsLinesColors[i].x /= 2;
		galaxyControl.visitedStarsLinesColors[i].y /= 2;
		galaxyControl.visitedStarsLinesColors[i].z /= 2;
	}
	
	// Añadir líneas.
	let color = new THREE.Vector3(0.5, 0.5, 0.5);
	let prevData = galaxyControl.visitedStars[galaxyControl.visitedStars.length - 2];
	galaxyControl.visitedStarsLinesColors.push(color);
	galaxyControl.visitedStarsLines.push(line.addFromStarData(prevData, data, color));
	
	// Visualizar nuevo sistema.
	gotoStarSystem(data);
}

/**
  * Función para visualizar un sistema estelar.
  *
  * @param data datos de la estrella.
  */
export function gotoStarSystem(data) {
	// Deseleccionar planeta.
	starSystemControl.selectedPlanetMesh.visible = false;
	starSystemControl.setSelectedPlanet(-1);
	starSystemControlUi.hidePlanetSelectedBox();
	
	if (viewLevel != gameConstants.VIEW_LEVEL_STARSYSTEM) {
		/*// Eliminar líneas anteriores.
		galaxyControl.setVisitedStarsLinesColors([]);
		for (let i = 0; i < galaxyControl.visitedStarsLines.length; ++i) {
			line.remove(galaxyControl.visitedStarsLines[i]);
		}
		
		// Vaciar histórico si no proviene de un sistema estelar.
		galaxyControl.setVisitedStars([]);
		galaxyControl.visitedStars.push(data);
		
		galaxyControl.setVisitedStarsPos(0);*/
	}
	
	// Inidicar nuevo nivel.
	viewLevel = gameConstants.VIEW_LEVEL_STARSYSTEM;
	
	// Establecer dirección de la cámara.
	starSystemControl.setDirX(-graphics.dirX);
	starSystemControl.setDirY(graphics.dirY - Math.PI);
	starSystemControl.resetAll();
	
	// Esconder elementos.
	galaxyControl.selectedStarMesh.visible = false;
	galaxyControl.hoverStarMesh.visible = false;
	galaxyControl.pointerMesh.visible = false;
	galaxyControl.setHoveredStar(-1);
	galaxyControl.setHoveredArm(-1);
	galaxyControl.setSelectedStar(-1);
	galaxyControl.setSelectedArm(-1);
	
	// Esconder elementos UI.
	galaxyControlUi.hideStarSelectedBox();
	
	// Datos de la estrella actual.
	starSystem.setCurrentStar(data);
	
	// Generar estrella.
	starSystem.generateStarSystem(starSystem.getStarGenerationSeed(data.armIndex, data.index), data);
	
	// Establecer posición a la estrella para realizar animación.
	let vertex = graphics.vertexCoordsToWorldCoords(galaxy.starMeshes[starSystem.currentStar.armIndex], starSystem.currentStar.index);
	starSystemControl.setPosX((-vertex.x + galaxy.view.camera.position.x) * 50);
	starSystemControl.setPosY((-vertex.y + galaxy.view.camera.position.y) * 50);
	starSystemControl.setPosZ((-vertex.z + galaxy.view.camera.position.z) * 50);
	starSystem.group.visible = false;
}

/**
  * Función para visualizar la galaxia.
  */
export function gotoGalaxy() {
	// Inidicar nuevo nivel.
	viewLevel = gameConstants.VIEW_LEVEL_GALAXY;
	
	// Establecer dirección de la cámara.
	galaxyControl.setDirX(-graphics.dirX);
	galaxyControl.setDirY(graphics.dirY - Math.PI);
	
	// Mostar elementos.
	galaxyControl.pointerMesh.visible = true;
}

/**
  * Settter mainMenu.
  *
  * @param value el nuevo valor.
  */
export function setMainMenu(value) {
	mainMenu = value;
	
	galaxyControl.hoverStarMesh.visible = !value;
	galaxyControl.selectedStarMesh.visible = !value;
	galaxyControl.pointerMesh.visible = !value;
	
	// Viajar a galaxia en caso de que no lo este.
	gotoGalaxy();
	
	// Deselecionar elementos.
	galaxyControl.unhoverStar();
	galaxyControl.unselectStar();
	
	starSystemControl.unhoverPlanet();
	starSystemControl.unselectPlanet();
	
	// Establecer valores iniciales en caso de estar en el menú principal.
	if (mainMenu) {
		// Dejar de mostrar elementos.
		galaxyControl.hoverStarMesh.visible = false;
		galaxyControl.selectedStarMesh.visible = false;
		galaxyControl.pointerMesh.visible = false;
		
		galaxyControl.setPosXTarget(0);
		galaxyControl.setPosYTarget(0);
		galaxyControl.setPosZTarget(0);
		galaxyControl.setDistanceTarget(400);
		galaxyControl.setDirXTarget(Math.PI / 3);
		
		// Desplazarse a los objetivos definidos.
		galaxyControl.setReachTarget(true);
	}
}

/**
  * Settter spectatorMode.
  *
  * @param value el nuevo valor.
  */
export function setSpectatorMode(value) {
	spectatorMode = value;
}

/**
  * Settter user. Adicionalmente, actualiza el estado de la UI.
  *
  * @param value el nuevo valor.
  */
export function setUser(value) {
	user = value;
	
	gameMenuUi.accountBox.querySelector('span.name').textContent = user.username;
}
