/**
  * Módulo de juego.
  * Este módulo se encarga de procesar cada instancia de la escena.
  */

import * as THREE from '/proyecto-fin-ciclo/js/libs/three.module.js';

import * as gameConstants from '/proyecto-fin-ciclo/js/constants/game-constants.js';

import * as graphics from '/proyecto-fin-ciclo/js/graphics/graphics.js';

import * as line from '/proyecto-fin-ciclo/js/game/line.js';

import * as universe from '/proyecto-fin-ciclo/js/game/scene/universe.js';
import * as galaxy from '/proyecto-fin-ciclo/js/game/scene/galaxy.js';
import * as galaxyControl from '/proyecto-fin-ciclo/js/game/scene/galaxy-control.js'
import * as galaxyControlUi from '/proyecto-fin-ciclo/js/game/scene/galaxy-control-ui.js'
import * as starSystem from '/proyecto-fin-ciclo/js/game/scene/starsystem.js';
import * as starSystemControl from '/proyecto-fin-ciclo/js/game/scene/starsystem-control.js'
import * as starSystemControlUi from '/proyecto-fin-ciclo/js/game/scene/starsystem-control-ui.js'

/** Nivel de vista. */
export let viewLevel = gameConstants.VIEW_LEVEL_GALAXY;

/** Aceleración de la gravedad. */
export let gravityAcc = 0.03;

/**
  * Función de inicialización del módulo.
  */
export function init() {
	// Iniciar universo.
	universe.init();
	// Iniciar galaxia.
	galaxy.init();
	// Iniciar sistema estelar.
	starSystem.init();
	
	// Iniciar líneas.
	line.init(galaxy.view.scene);
}

/**
  * Función de bucle del módulo.
  */
export function update() {
	if (false) {
		// Menú de pausa.
		
	} else {
		universe.update();
		galaxy.update();
		starSystem.update();
		
		line.update();
	}
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
	starSystem.generateStarSystem(data.index, data);
	
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
