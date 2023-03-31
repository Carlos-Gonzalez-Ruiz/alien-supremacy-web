/**
  * Módulo de control de sistema estelar.
  */

import * as THREE from '/js/libs/three.module.js';

import * as gameConstants from '/js/constants/game-constants.js';
import * as keyboardConstants from '/js/constants/keyboard-constants.js';

import * as graphics from '/js/graphics/graphics.js';
import * as keyboard from '/js/keyboard/keyboard.js';

import * as game from '/js/game/game.js';

import * as galaxyControl from '/js/game/scene/galaxy-control.js'
import * as galaxyControlUi from '/js/game/scene/galaxy-control-ui.js';

import * as starSystem from '/js/game/scene/starsystem.js';
import * as starSystemControlUi from '/js/game/scene/starsystem-control-ui.js';

/** Raycaster. */
let raycaster;
/** Pointer del raycaster. */
let raycasterPointer = new THREE.Vector2(0, 0);

/** Posición X. */
export let posX = 0;
/** Posición Y. */
export let posY = 0;
/** Posición Z. */
export let posZ = 0;

/** Velocicidad de movimiento de posición. */
let posSpeed = 0;
/** Velocicidad de movimiento de posición Strafe. */
let posSpeedStrafe = 0;
/** Velocidad máxima de movimiento de posición. */
let posSpeedMax = 1;
/** Aceleración de movimiento de posición. */
let posAcc = 0.1;
/** Deaceleración de movimiento de posición. */
let posDeacc = 2;

/** Dirección X. */
export let dirX = 0;
/** Dirección Y. */
export let dirY = 0;

/** Velocidad de dirección X. */
let dirSpeedX = 0;
/** Velocidad de dirección Y. */
let dirSpeedY = 0;
/** Velocidad máxima de dirección. */
let dirSpeedMax = 0.02;
/** Aceleración de dirección. */
let dirAcc = 0.003;
/** Deaceleración de dirección. */
let dirDeacc = 2;

/** Distancia a la cámara. */
export let distance = 50;
/** Distancia mínima de la cámara. */
let distanceMin = 10;
/** Distancia máxima de la cámara. */
let distanceMax = 250;
/** Aplica suavizado al cambio de distancia de la caḿara. */
let distanceSpeed = 0;
/** Sensibilidad a la rueda del ratón. */
let distanceSpeedFactor = 4;
/** Aplica suavizado al dejar de cambiar de distancia de la caḿara. */
let distanceDeacc = 1.5;

/** Indica si está cargando o no. */
let loading = false;

/**
  * Función de inicialización del módulo.
  */
export function init() {
	// Raycaster.
	raycaster = new THREE.Raycaster();
	raycaster.params.Points.threshold = 0.5;
	
	starSystemControlUi.init();
}

/**
  * Función de bucle del módulo.
  */
export function update() {
	starSystemControlUi.update();
	
	// Solo permitir control en caso de que el nivel sea el adecuado.
	if (game.viewLevel == gameConstants.VIEW_LEVEL_STARSYSTEM) {
		if (loading && starSystem.group.visible) {
			let dst = Math.sqrt(posX * posX + posY * posY + posZ * posZ);
			if (dst > 0.025) { // Para cuando se llegue a cierto punto.
				let dstXZ = Math.sqrt(posX * posX + posZ * posZ);
				
				let dirX = Math.atan2(dstXZ, posY);
				let dirY = Math.atan2(posX, posZ);
				
				posX -= Math.sin(dirY) * dst / 5 * Math.sin(dirX);
				posY -= Math.cos(dirX) * dst / 5;
				posZ -= Math.cos(dirY) * dst / 5 * Math.sin(dirX);
			} else {
				posX = 0;
				posY = 0;
				posZ = 0;
				
				loading = false;
			}
		}
		
		movement();
		camera();
		userInterface();
	}
}

/**
  * Función para los controles de la cámara relativos al movimiento.
  */
function movement() {
	movementKeyboard();
	movementCursor();
}

/**
  * Función para los controles de la cámara relativos al movimiento. (Teclado)
  */
function movementKeyboard() {
	/// Movimiento cámara.
	{
		// Normal.
		let noKey = true;
		
		if (keyboard.checkPressed('W')) {
			if (posSpeed < posSpeedMax) {
				posSpeed += posAcc;
			}
			
			noKey = false;
		}
		if (keyboard.checkPressed('S')) {
			if (posSpeed > -posSpeedMax) {
				posSpeed -= posAcc;
			}
			
			noKey = false;
		}
		if (noKey) {
			posSpeed /= posDeacc;
		}
		
		// Strafe.
		let noKeyStrafe = true;
		
		if (keyboard.checkPressed('A')) {
			if (posSpeedStrafe < posSpeedMax) {
				posSpeedStrafe += posAcc;
			}
			
			noKeyStrafe = false;
		}
		if (keyboard.checkPressed('D')) {
			if (posSpeedStrafe > -posSpeedMax) {
				posSpeedStrafe -= posAcc;
			}
			
			noKeyStrafe = false;
		}
		if (noKeyStrafe) {
			posSpeedStrafe /= posDeacc;
		}
		
		// Aplicar velocidad a la posición.
		posX += posSpeed * Math.sin(dirY) + posSpeedStrafe * Math.sin(dirY + Math.PI / 2);
		posZ += posSpeed * Math.cos(dirY) + posSpeedStrafe * Math.cos(dirY + Math.PI / 2);
	}
	
	/// Rotación cámara.
	{
		// Eje X.
		let noKeyX = true;
		
		if (keyboard.checkPressed('ArrowUp')) {
			if (dirSpeedX < dirSpeedMax) {
				dirSpeedX += dirAcc;
			}
			
			noKeyX = false;
		}
		if (keyboard.checkPressed('ArrowDown')) {
			if (dirSpeedX > -dirSpeedMax) {
				dirSpeedX -= dirAcc;
			}
			
			noKeyX = false;
		}
		if (noKeyX) {
			dirSpeedX /= dirDeacc;
		}
		
		// Eje Y.
		let noKeyY = true;
		
		if (keyboard.checkPressed('ArrowLeft')) {
			if (dirSpeedY > -dirSpeedMax) {
				dirSpeedY -= dirAcc;
			}
			
			noKeyY = false;
		}
		if (keyboard.checkPressed('ArrowRight')) {
			if (dirSpeedY < dirSpeedMax) {
				dirSpeedY += dirAcc;
			}
			
			noKeyY = false;
		}
		if (noKeyY) {
			dirSpeedY /= dirDeacc;
		}
		
		// Aplicar velocidad a la direción.
		dirX += dirSpeedX;
		dirY += dirSpeedY;
	}
	
	/// Distancia de la cámara.
	{
		let deltaY = keyboard.checkPressed('+') - keyboard.checkPressed('-');
		
		if ((deltaY < 0 && distance + deltaY * distanceDeacc > distanceMin) ||
		(deltaY > 0 && distance + deltaY * distanceDeacc < distanceMax)) {
			distanceSpeed = deltaY * distanceSpeedFactor * distance / 100;
		} else {
			distanceSpeed /= distanceDeacc;
		}
	}
	
	if (keyboard.checkPressed('R')) {
		starSystem.objectGroup.position.x += 1;
	}
}

/**
  * Función para los controles de la cámara relativos al movimiento. (Ratón)
  */
function movementCursor() {
	if (keyboard.checkMouseButtonPressed(keyboardConstants.MB_MIDDLE)) {
		let cursorSpeedX = keyboard.cursorDeltaX / (1 / distance) / 600;
		let cursorSpeedZ = keyboard.cursorDeltaY / (1 / distance) / 600;
		let cursorSpeed = Math.sqrt(cursorSpeedX * cursorSpeedX + cursorSpeedZ * cursorSpeedZ);
		let cursorDir = Math.atan2(cursorSpeedX, cursorSpeedZ);
		
		posX += cursorSpeed * Math.sin(dirY + cursorDir);
		posZ += cursorSpeed * Math.cos(dirY + cursorDir);
	} else if (keyboard.checkMouseButtonPressed(keyboardConstants.MB_RIGHT)) {
		dirX += keyboard.cursorDeltaY / 400;
		dirY -= keyboard.cursorDeltaX / 400;
	}
	
	// Limitar cámara.
	if (dirX > Math.PI / 2) {
		dirX = Math.PI / 2;
	} else if (dirX < -Math.PI / 2) {
		dirX = -Math.PI / 2;
	}
	
	// Distancia de la cámara.
	if ((keyboard.wheelDeltaY < 0 && distance + keyboard.wheelDeltaY * distanceDeacc > distanceMin) ||
	(keyboard.wheelDeltaY > 0 && distance + keyboard.wheelDeltaY * distanceDeacc < distanceMax)) {
		distanceSpeed = keyboard.wheelDeltaY * distanceSpeedFactor * distance / 100;
	} else {
		distanceSpeed /= distanceDeacc;
	}
	
	distance += distanceSpeed;
}

/**
  * Función para la representación de la cámara.
  */
function camera() {
	// Posicionamiento de la cámara.
	starSystem.view.camera.position.x = posX - Math.sin(dirY) * Math.cos(dirX) * distance;
	starSystem.view.camera.position.y = posY + Math.sin(dirX) * distance;
	starSystem.view.camera.position.z = posZ - Math.cos(dirY) * Math.cos(dirX) * distance;
	
	// Aplicar rotacion XYZ
	graphics.setDirX(-dirX);
	graphics.setDirY(dirY - Math.PI);
}

/**
  * Función para todo lo relativo a temas de interfaz de usuario de manera general.
  */
function userInterface() {
	// Comprobar intersecciones.
	let maxDistance = 100;
	let timeRate = 200;
	
	if (Math.floor(Date.now() / timeRate) % 1 == 0) {
		raycasterPointer.x = (keyboard.cursorPosX / graphics.canvas.width) * 2 - 1;
		raycasterPointer.y = - (keyboard.cursorPosY / graphics.canvas.height) * 2 + 1;
		raycaster.setFromCamera(raycasterPointer, starSystem.view.camera);
		raycaster.far = maxDistance;
		
		/*let intersections = raycaster.intersectObjects(, false);
		if (intersections.length > 0) {
		}*/
	}
}


/**
  * Callback de actualización cuando la cámara sea actualizada.
  */
export function cameraOnUpdate() {
	// Actualizar interfaz de usuario DOM.
	starSystemControlUi.cameraOnUpdate();
	// Adicionalmente, actualizar el de galaxia.
	galaxyControlUi.cameraOnUpdate();
}

/**
 * Función para liberar de la memoria del módulo.
 */
export function destroy() {

}

/**
  * Función para resetear todos las variables de control.
  */
export function resetAll() {
	// Resetear posición y distancia.
	posX = 0;
	posY = 0;
	posZ = 0;
	distance = 200;
	
	// Indicar inicio de carga.
	loading = true;
}

/**
  * Función para ir a la estrella siguiente del histórico de estrellas visitadas.
  */
export function goPrevStar() {
	let newVisitedStarsPos = galaxyControl.visitedStarsPos - 1;
	
	if (newVisitedStarsPos >= 0) {
		galaxyControl.setVisitedStarsPos(newVisitedStarsPos);
		
		game.gotoStarSystem(galaxyControl.visitedStars[newVisitedStarsPos]);
	}
}

/**
  * Función para ir a la estrella siguiente del histórico de estrellas visitadas.
  */
export function goNextStar() {
	let newVisitedStarsPos = galaxyControl.visitedStarsPos + 1;
	
	if (newVisitedStarsPos < galaxyControl.visitedStars.length) {
		galaxyControl.setVisitedStarsPos(newVisitedStarsPos);
		
		game.gotoStarSystem(galaxyControl.visitedStars[newVisitedStarsPos]);
	}
}

/**
  * Settter dirX.
  *
  * @param newDir el nuevo valor de dirX.
  */
export function setDirX(newDir) {
	dirX = newDir;
}

/**
  * Settter dirY.
  *
  * @param newDir el nuevo valor de dirY.
  */
export function setDirY(newDir) {
	dirY = newDir;
}

/**
  * Settter posX.
  *
  * @param value el nuevo valor.
  */
export function setPosX(value) {
	posX = value;
}

/**
  * Settter posY.
  *
  * @param value el nuevo valor.
  */
export function setPosY(value) {
	posY = value;
}

/**
  * Settter posZ.
  *
  * @param value el nuevo valor.
  */
export function setPosZ(value) {
	posZ = value;
}
