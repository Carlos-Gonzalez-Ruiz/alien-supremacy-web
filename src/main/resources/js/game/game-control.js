/**
  * Módulo de control de sistema estelar.
  */

import * as THREE from '/js/libs/three.module.js';
import { OBJLoader } from '/js/libs/OBJLoader.js';

import * as keyboardConstants from '/js/constants/keyboard-constants.js';

import * as graphics from '/js/graphics/graphics.js';
import * as keyboard from '/js/keyboard/keyboard.js';

import * as game from '/js/game/game.js';
import * as audio from '/js/game/audio.js';

import * as gameMenuUi from '/js/game/game-menu-ui.js';

import * as gameControlUi from '/js/game/game-control-ui.js';

import * as starSystem from '/js/game/scene/starsystem.js';

/** Coordenada X de dónde empieza la selección de unidad / tropa. */
export let selectPosX = 0;
/** Coordenada Y de dónde empieza la selección de unidad / tropa. */
export let selectPosY = 0;

/** Indicar si se está haciendo selección de tropa. */
export let selecting = false;

/** Texture de nave. */
let spaceshipTexture;

/** Lista de naves de combate. */
export let combatShips = [];

/**
  * Función de inicialización del módulo.
  */
export function init() {
	// Interfaz.
	gameControlUi.init();
	
	// Texturas.
	spaceshipTexture = new THREE.TextureLoader().load('/image/spaceship.png');
	spaceshipTexture.wrapS = spaceshipTexture.wrapT = THREE.RepeatWrapping;
	spaceshipTexture.minFilter = spaceshipTexture.magFilter = graphics.filtering;
}

/**
  * Función de comienzo de partida.
  */
export function startGame() {
	// Para de reproducir menú.
	gameMenuUi.backgroundMusic.stop();
	
	// Reproducir sonido.
	audio.soundGameStart.on('end', function(){
		gameControlUi.backgroundMusic.play();
	});
	audio.soundGameStart.play();
}

/**
  * Función de bucle del módulo.
  */
export function update() {
	// Solo permitir selección si no se encuentra en el menú ni en modo espectador.
	if (!game.mainMenu && !game.spectatorMode) {
		// Caja de selección de tropa / unidad.
		if (keyboard.checkMouseButtonPressedOnce(keyboardConstants.MB_LEFT)) {
			selectPosX = keyboard.cursorPosX;
			selectPosY = keyboard.cursorPosY;
		}
		
		if (keyboard.checkMouseButtonPressed(keyboardConstants.MB_LEFT)) {
			if (selectPosX != null && selectPosY != null) {
				gameControlUi.displaySelectBox();
				
				// Detectar si las naves están siendo seleccionadas.
				for (let i = 0; i < combatShips.length; ++i) {
					let combatShip = combatShips[i];
					let coords = graphics.realCoordsToScreenCoords(starSystem.view.camera, combatShip.mesh.position);
					
					if (	((selectPosX < keyboard.cursorPosX && coords.x > selectPosX && coords.x < keyboard.cursorPosX) ||
						(selectPosX > keyboard.cursorPosX && coords.x > keyboard.cursorPosX && coords.x < selectPosX)) &&
						
						((selectPosY < keyboard.cursorPosY && coords.y > selectPosY && coords.y < keyboard.cursorPosY) ||
						(selectPosY > keyboard.cursorPosY && coords.y > keyboard.cursorPosY && coords.y < selectPosY))
					) {
						combatShip.material.color.r = 1;
						combatShip.material.color.g = 0;
						combatShip.material.color.b = 0;
					} else {
						combatShip.material.color.r = 1;
						combatShip.material.color.g = 1;
						combatShip.material.color.b = 1;
					}
				}
			}
		}
		
		if (keyboard.checkMouseButtonReleased(keyboardConstants.MB_LEFT)) {
			selectPosX = null;
			selectPosY = null;
			
			gameControlUi.hideSelectBox();
		}
	}
	
	// Desplazar naves que tengan conflictos de posición.
	shiftShipPositions();
}

/**
  * Función para cuando haya un conflicto de posición en la que haya varias naves juntas.
  */
let currentCombatShip = 0;
function shiftShipPositions() {
	const DISTANCE = 16;
	const SPEED = 10;
	for (let i = 0; i < combatShips.length; ++i) {
		if (i != currentCombatShip) {
			let otherCombatShipPos = combatShips[i].mesh.position;
			let combatShipPos = combatShips[currentCombatShip].mesh.position;
			
			let deltaX = -otherCombatShipPos.x + combatShipPos.x;
			let deltaZ = -otherCombatShipPos.z + combatShipPos.z;
			
			if (deltaX > -DISTANCE && deltaX < DISTANCE && deltaZ > -DISTANCE && deltaZ < DISTANCE) {
				let dir = Math.atan2(deltaX, deltaZ);
				
				combatShipPos.x += SPEED * Math.sin(dir);
				combatShipPos.z += SPEED * Math.cos(dir);
			}
		}
	}
	++currentCombatShip;
	if (currentCombatShip >= combatShips.length) { currentCombatShip = 0; }
}

/**
  * Callback de actualización cuando la cámara sea actualizada.
  */
export function cameraOnUpdate() {
	// Actualizar interfaz de usuario DOM.
	gameControlUi.cameraOnUpdate();
}

/**
  * Función para liberar de la memoria una nave de combate.
  * 
  * @param index el índice de la nave a eliminar.
  */
export function destroyCombatShipMemory(index) {
	let combatShip = combatShips[i];
	
	combatShip.material.dispose();
	scene.remove(combatShip);
	
	combatShip.splice(i, 1);
}

/**
 * Función para liberar de la memoria del módulo.
 */
export function destroy() {
	spaceshipTexture.dispose();
	
	for (let i = 0; i < combatShips.length; ++i) {
		combatShips[i].material.dispose();
		scene.remove(combatShips[i]);
	}
}

/**
  * Función para crear una nave de combate.
  * 
  * @param starData datos del sistema estelar.
  * @param planetData datos del planet.
  */
let currentId = 0;
export function createCombatShip(starData, planetData) {
	let combatShip = {};
	
	// Atributos de nave.
	combatShip.id = currentId++;
	combatShip.health = 10;
	combatShip.attack = 2;
	combatShip.coolDown = 40;
	combatShip.target = new THREE.Vector3(0, 0, 0);
	combatShip.reachedTarget = true;
	
	// Datos adicionales.
	combatShip.starData = starData;
	
	// Representación gráfica.
	let loader = new OBJLoader();

	// Cargar modelo.
	loader.load(
		'/models/spaceship.obj',
		
		function (object) {
			combatShip.material = new THREE.MeshLambertMaterial({
				map: spaceshipTexture
			});
			combatShip.mesh = object;
			combatShip.mesh.position.x = starSystem.groupPlanets[planetData.index].position.x;
			combatShip.mesh.position.y = starSystem.groupPlanets[planetData.index].position.y + 30;
			combatShip.mesh.position.z = starSystem.groupPlanets[planetData.index].position.z;
			
			// Aplicar material.
			combatShip.mesh.traverse(function(child) {
				if (child instanceof THREE.Mesh) {
					child.material = combatShip.material;
				}
			});
			
			starSystem.view.scene.add(combatShip.mesh);
			
			// Añadir a la lista.
			combatShips.push(combatShip);
		},
		
		function (xhr) {
			//console.log(( xhr.loaded / xhr.total * 100 ) + '% loaded');
		},
		
		function (error) {
			console.log('An error ocurred:');
			console.log(error);
		}
	);
}

/**
  * Función para destruir una nave de combate.
  * 
  * @param index el índice de la nave a eliminar.
  */
export function destroyCombatShip(index) {
	// Mostrar animación y ejecutar sonido.
	
	// Eliminar de la memoria.
	destroyCombatShipMemory(index);
}

/**
  * Settter selecting.
  *
  * @param value el nuevo valor.
  */
export function setSelecting(value) {
	selecting = value;
}
