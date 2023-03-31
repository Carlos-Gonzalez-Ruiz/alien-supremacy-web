/**
  * Módulo para un movimiento básico de cámara.
  */

import * as THREE from '/js/libs/three.module.js';

import * as keyboardConstants from '/js/constants/keyboard-constants.js';

import * as graphics from '/js/graphics/graphics.js';
import * as keyboard from '/js/keyboard/keyboard.js';

/** Velocidad de la cámara. */
let speed = 1;
/** Dirección X de la cámara. */
let dirX = 0;
/** Dirección Y de la cámara. */
let dirY = 0;

/**
  * Función de inicialización del módulo.
  */
export function init() {
	
}

/**
  * Función de bucle del módulo.
  */
export function update() {
	dirX += keyboard.cursorDeltaY / keyboardConstants.MOUSE_SENSIVITY;
	dirY -= keyboard.cursorDeltaX / keyboardConstants.MOUSE_SENSIVITY;
	
	// Limitar cámara.
	if (dirX > Math.PI / 2) {
		dirX = Math.PI / 2;
	} else if (dirX < -Math.PI / 2) {
		dirX = -Math.PI / 2;
	}
	
	graphics.camera.setRotationFromEuler(new THREE.Euler(-dirX, dirY - Math.PI, 0, 'YXZ'));
	
	if (keyboard.checkPressed('W')) {
		console.log(graphics.camera.position);
		graphics.camera.position.x = speed * Math.sin(dirY) * Math.cos(dirX);
		graphics.camera.position.y = speed * -Math.sin(dirX);
		graphics.camera.position.z = speed * Math.cos(dirY) * Math.cos(dirX);
	}
	if (keyboard.checkPressed('A')) {
		graphics.camera.position.x += speed * Math.sin(dirY + Math.PI / 2);
		graphics.camera.position.z += speed * Math.cos(dirY + Math.PI / 2);
	}
	if (keyboard.checkPressed('S')) {
		graphics.camera.position.x -= speed * Math.sin(dirY) * Math.cos(dirX);
		graphics.camera.position.y -= speed * -Math.sin(dirX);
		graphics.camera.position.z -= speed * Math.cos(dirY) * Math.cos(dirX);
	}
	if (keyboard.checkPressed('D')) {
		graphics.camera.position.x += speed * Math.sin(dirY - Math.PI / 2);
		graphics.camera.position.z += speed * Math.cos(dirY - Math.PI / 2);
	}
}

/**
 * Función para liberar de la memoria los datos del módulo.
 */
export function destroy() {

}
