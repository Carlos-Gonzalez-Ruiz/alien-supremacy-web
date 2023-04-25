/**
  * Módulo para obtener nombres aleatorios.
  *
  * Este generador es muy primivitivo y los algoritmos son totalmente provisionales.
  *
  */

import * as random from '/js/random/random.js';

/** Longitud mínima de las palabras en sílabas. */
const MIN_LENGTH = 0;
/** Longitud máxima de las palabras en sílabas. */
const MAX_LENGTH = 4;
/** Cadena de vocales. */
const VOCALS = [ 'A', 'E', 'I', 'O', 'U', 'Y' ];
/** Cadena de consonantes. */
const CONSONANTS = [ 'B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z' ];
/** Cadena de consonantes dobles. */
const DOUBLE_CONSONANTS = ['SH', 'CR', 'DR', 'GR', 'KR', 'PR', 'QU', 'FR', 'BR']

/**
  * Función que devuelve un nombre generado aleatoriamente, sin especificar semilla.
  *
  * @return el nombre generado aleatoriamente.
  */
export function generate() {
	let name = '';
	
	// Generar nombre.
	let length = MIN_LENGTH + random.get() * (MAX_LENGTH - MIN_LENGTH);
	for (let i = 0; i < length; ++i) {
		if (getRandomBool()) {
			name += (getRandomBool() ? getConsonant() : getDoubleConsonant()) + getVocal();
		} else {
			name += getVocal() + getConsonant();
		}
	}
	
	// Capitalizar nombre.
	name = name[0] + name.toLowerCase().slice(1);
	
	// Añadir numeración.
	if (getRandomBool()) {
		if (getRandomBool()) {
			name += ' ' + getRomanNumber(Math.floor(1 + random.get() * 10));
		} else if (getRandomBool()) {
			name += ' ' + Math.floor(1 + random.get() * 10);
		} else if (getRandomBool()) {
			name += '-' + Math.floor(1 + random.get() * 10);
		}
	}
	
	return name;
}

/**
  * Función útil que devuelve una vocal aleatoria.
  *
  * @return la vocal.
  */
function getVocal() {
	return VOCALS[Math.floor(random.get() * VOCALS.length)];
}

/**
  * Función útil que devuelve una consonante aleatoria.
  *
  * @return la consonante.
  */
function getConsonant() {
	return CONSONANTS[Math.floor(random.get() * CONSONANTS.length)];
}

/**
  * Función útil que devuelve una consonante doble aleatoria.
  *
  * @return la consonante doble.
  */
function getDoubleConsonant() {
	return DOUBLE_CONSONANTS[Math.floor(random.get() * DOUBLE_CONSONANTS.length)];
}

/**
  * Función útil que devuelve el número en notación romana. (WIP)
  */
function getRomanNumber(number) {
	let romanNumber = '';
	
	while (number > 0) {
		let digit = '';
		
		// TODO: Añadir más digitos.
		if (number >= 10) {
			digit = 'X';
			number -= 10;
		} else if (number == 9) {
			digit = 'IX';
			number -= 9;
		} else if (number >= 5) {
			digit = 'V';
			number -= 5;
		} else if (number == 4) {
			digit = 'IV';
			number -= 4;
		} else {
			digit = 'I';
			number -= 1;
		}
		
		romanNumber += digit;
	}
	
	return romanNumber;
}

/**
  * Función útil para obtener un verdadero o falso aleatorio.
  */
function getRandomBool() {
	return random.get() > 0.5;
}
