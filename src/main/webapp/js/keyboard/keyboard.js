/** 
  * Gestión de entrada del usuario.
  * Usar https://www.toptal.com/developers/keycode, para más información sobre la nomenclatura de las teclas.
  */

import * as keyboardConstants from '/js/constants/keyboard-constants.js';

import * as domUi from '/js/dom-ui/dom-ui.js';
import * as graphics from '/js/graphics/graphics.js';
import * as game from '/js/game/game.js';

/** Estado de las teclas. */
let pressed = {};
/** Estado de las teclas del anterior frame. */
let pressedPrev = {};
/** Estado de las teclas (case insenstive). */
let pressedCaps = {};
/** Estado de las teclas (case insenstive) del anterior frame. */
let pressedCapsPrev = {};

/** Botones del ratón */
let mousePressed = [];
/** Botones del ratón del anterior frame. */
let mousePressedPrev = [];

/** Rueda del ratón. */
export let wheelDeltaY = 0;

/** Posición X del ratón. */
export let cursorPosX = 0;
/** Posición Y del ratón. */
export let cursorPosY = 0;

/** Movimiento del ratón X */
export let cursorDeltaX = 0;
/** Movimiento del ratón Y */
export let cursorDeltaY = 0;

/** Indiciar si el ratón se encuentra dentro de la interfaz DOM. (cualquiera) */
export let onDomUI = false;
/** Indiciar si el ratón se encuentra dentro de la interfaz DOM scrollable. */
export let onDomUIScrollable = false;

/**
  * Función que añade los lambda para registrar ciertos eventos de teclas.
  */
export function init() {
	// Teclas.
	document.body.onkeyup = function(e) {
		pressed[e.key] = false;
		pressedCaps[e.key.toUpperCase()] = false;
	}
	document.body.onkeydown = function(e) {
		pressed[e.key] = true;
		pressedCaps[e.key.toUpperCase()] = true;
	}
	
	// Botones del ratón.
	graphics.canvas.onmousedown = function(e) {
		if (!onDomUI) {
			mousePressed[e.button] = true;
		}
	};
	document.body.onmouseup = function(e) {
		mousePressed[e.button] = false;
	};
	
	// Inidicar si el ratón está dentro de la interfaz.
	domUi.div.onmouseover = function(e) {
		onDomUI = true;
	};
	domUi.div.onmouseout = function(e) {
		onDomUI = false;
	};
	domUi.divScrollable.onmouseover = function(e) {
		onDomUI = true;
		onDomUIScrollable = true;
	};
	domUi.divScrollable.onmouseout = function(e) {
		onDomUI = false;
		onDomUIScrollable = false;
	};
	
	// Resetear botones al salirse del canvas.
	graphics.canvas.onmouseout = function (e) {
		let rect = e.target.getBoundingClientRect();
		let x = e.clientX;
		let y = e.clientY;
		
		if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
			mousePressed[0] = false;
			mousePressed[1] = false;
			mousePressed[2] = false;
		}
	}
	
	// Hacer que el usuario no hacer click derecho por temas de controles.
	document.body.addEventListener('contextmenu', event => event.preventDefault());
	
	// Rueda del ratón.
	document.body.onwheel = function(event) {
		if (!onDomUIScrollable) {
			if (event.deltaY > 0) {
				wheelDeltaY = 1;
			} else if (event.deltaY < 0) {
				wheelDeltaY = -1;
			}
		}
	};
	
	// Movimiento del ratón.
	document.body.onmousemove = function(event) {
		cursorPosX = event.clientX;
		cursorPosY = event.clientY;
		
		cursorDeltaX = event.movementX;
		cursorDeltaY = event.movementY;
	};
	
	// Esconder el ratón al hacer click en canvas.
	/*graphics.canvas.addEventListener("click", async function() {
		await graphics.canvas.requestPointerLock();
	});*/
}

/**
  * Función para el procesamiento de teclas.
  */
export function keyProcessing() {
	// Estado de las teclas del anterior frame.
	pressedPrev = structuredClone(pressed);
	pressedCapsPrev = structuredClone(pressedCaps);
	
	// Botones del ratón del anterior frame.
	mousePressedPrev = structuredClone(mousePressed);
	
	// Rueda del ratón.
	wheelDeltaY = 0;
	
	// Movimiento del ratón.
	cursorDeltaX /= keyboardConstants.MOUSE_SMOOTHNESS;
	cursorDeltaY /= keyboardConstants.MOUSE_SMOOTHNESS;
}

/**
  * Función para comprobar si cierta tecla esta siendo presionada.
  * 
  * @param key la tecla.
  * @return la tecla ha sido presionada.
  */
export function checkPressed(key) {
	// Devolver falso en caso de que esté haciendo focus.
	if (document.activeElement === document.body) {
		return pressedCaps[key.toUpperCase()];
	} else {
		return false;
	}
}

/**
  * Función para comprobar si cierta tecla ha sido presionada (solo 1 vez)
  * 
  * @param key la tecla.
  * @return la tecla ha sido presionada.
  */
export function checkPressedOnce(key) {
	// Devolver falso en caso de que esté haciendo focus.
	if (document.activeElement === document.body) {
		return pressedCaps[key.toUpperCase()] && !pressedCapsPrev[key.toUpperCase()];
	} else {
		return false;
	}
}

/**
  * Función para comprobar si cierta tecla se ha dejado de presionar.
  * 
  * @param key la tecla.
  * @return la tecla se ha dejado de presionar.
  */
export function checkReleased(key) {
	// Devolver falso en caso de que esté haciendo focus.
	if (document.activeElement === document.body) {
		return !pressedCaps[key.toUpperCase()] && pressedCapsPrev[key.toUpperCase()];
	} else {
		return false;
	}
}

/**
  * Función para comprobar si determinado botón del ratón ha sido presionado.
  * Se ha de pasar como parámetro uno de las constantes definidas en keyboard-constants.js.
  *
  * @param button el botón.
  * @return el botón ha sido presionado.
  */
export function checkMouseButtonPressed(button) {
	return mousePressed[button];
}

/**
  * Función para comprobar si determinado botón del ratón ha sido presionado (solo 1 vez).
  * Se ha de pasar como parámetro uno de las constantes definidas en keyboard-constants.js.
  *
  * @param button el botón.
  * @return el botón ha sido presionado.
  */
export function checkMouseButtonPressedOnce(button) {
	return mousePressed[button] && !mousePressedPrev[button]
}

/**
  * Función para comprobar si determinado botón del ratón se ha dejado de presionar.
  * Se ha de pasar como parámetro uno de las constantes definidas en keyboard-constants.js.
  *
  * @param button el botón.
  * @return el botón ha sido presionado.
  */
export function checkMouseButtonReleased(button) {
	return !mousePressed[button] && mousePressedPrev[button];
}
