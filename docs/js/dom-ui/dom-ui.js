/**
  * Módulo para añadir elementos a una interfaz gráfica usando el DOM.
  */

import * as game from './js/game/game.js';

/** Contenedor de interfaz. */
export let div;

/** Contenedor de interfaz scrollable. */
export let divScrollable;

/** Lista de elementos de interfaz. */
export let elements = [];

/**
  * Función de inicialización del módulo.
  */
export function init() {
	// Crear elemento.
	div = document.createElement('div');
	div.id = 'dom-ui-div';
	div.classList.add('dom-ui');
	
	divScrollable = document.createElement('div');
	divScrollable.id = 'dom-ui-div-scrollable';
	divScrollable.classList.add('dom-ui');
	
	// Añadir elemento.
	document.body.appendChild(div);
	document.body.appendChild(divScrollable);
}

/**
  * Función para crear un elemento de interfaz.
  * Por defecto, no muestra el elemento creado. Se ha de permitir su visualización
  * mediante la función displayElement().
  * 
  * @param html el código HTML a mostrar.
  * @return el elemento creado.
  */
export function createElement(html) {
	// Crear elemento dummy.
	let element = document.createElement('div');
	element.id = 'ui#' + elements.length;
	element.innerHTML = html;
	
	elements.push(element);
	
	// Instertar elemento.
	div.appendChild(element);
	
	// Esonder elemento.
	hideElement(element);
	
	return element;
}

/**
  * Función para eliminar un elemento de interfaz.
  * El elemento pasado como parámetro ha de haber sido añadido anteriormente al interfaz.
  *
  * @param element el elemento a borrar.
  */
export function removeElement(element) {
	div.removeChild(element);
}

/**
  * Función para mostrar cierto elemento, haciendo un 'element.style.display = 'inline-block''
  * Si se especifican coordenadas algunas (X o Y), el atributo CSS 'position' se establece a 'absolute'.
  *
  * @param element el elemento a mostrar.
  * @param x coordenadas X en dónde mostrar el nuevo elemento. (opcional) Ej.: '2px'
  * @param y coordenadas Y en dónde mostrar el nuevo elemento. (opcional) Ej.: '12px'
  * @param z z-index en dónde mostrar el nuevo elemento. (opcional)
  */
export function displayElement(element, x, y, z) {
	element.style.display = 'inline-block';
	
	// Coordenadas X.
	if (typeof x != 'undefined') {
		element.style.position = 'absolute';
		element.style.width = 'max-content';
		element.style.left = x;
	}
	
	// Coordenadas Y.
	if (typeof y != 'undefined') {
		element.style.position = 'absolute';
		element.style.width = 'max-content';
		element.style.top = y;
	}
	
	// Z-index.
	if (typeof z != 'undefined') {
		element.style.zIndex = z;
	}
}

/**
  * Función para esconder cierto elemento, haciendo un 'element.style.display = 'none''
  *
  * @param element el elemento a esconder.
  */
export function hideElement(element) {
	element.style.display = 'none';
}

/**
  * Función para establecer el posicionamiento de un elemento con position = 'absolute'.
  *
  * @param element el elemento.
  * @param x la coordenada X.
  * @param y la coordenada Y.
  * @param z el z-index.
  */
export function setElementPos(element, x, y, z) {
	// Coordenadas X.
	if (typeof x != 'undefined') {
		element.style.left = x;
	}
	
	// Coordenadas Y.
	if (typeof y != 'undefined') {
		element.style.top = y;
	}
	
	// Z-index.
	if (typeof z != 'undefined') {
		element.style.zIndex = z;
	}
}

/**
  * Función para obtener el ancho de un elemento, ya sea escondido o siendo mostrado.
  *
  * @param element el elemento.
  * @return el ancho.
  */
export function getWidth(element) {
	let width = 0;
	let prev = element.style.display;
	
	element.style.display = 'inline-block';
	width = element.offsetWidth;
	element.style.display = prev;
	
	return width;
}

/**
  * Función para obtener el alto de un elemento, ya sea escondido o siendo mostrado.
  *
  * @param element el elemento.
  * @return el alto.
  */
export function getHeight(element) {
	let height = 0;
	let prev = element.style.display;
	
	element.style.display = 'inline-block';
	height = element.offsetHeight;
	element.style.display = prev;
	
	return height;
}

/**
  * Función de bucle del módulo.
  */
export function update() {

}

/**
 * Función para liberar de la memoria los datos del módulo.
 */
export function destroy() {

}
