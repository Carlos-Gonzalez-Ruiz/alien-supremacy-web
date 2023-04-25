/**
  * Módulo para obtener números aleatorios.
  * Port de un algoritmo escrito en C propio, usando signed integers en vez de unsigned.
  *
  * Este viene muy útil para definir un comportamiento estándar en lo relativo a la generación procedural.
  * No obstante, al no ser una versión nativa, es notablemente más lenta a "Math.random()".
  */

/**
  * Función que devuelve un número aleatorio entre 0 y 1 incluidos.
  *
  * @return el número aleatorio.
  */
export function get() {
	return get1();
}

/**
  * Función para establecer una nueva semilla.
  *
  * @param newSeed la nueva semilla.
  */
export function setSeed(newSeed) {
	setSeed1(newSeed);
}

export let random_seed1 = 1 ^ 0x3432; // Ox3432 = "42" (ASCII)
export let random_seed2 = 1;

const SIZE = 2147483648;

/**
  * Algoritmo #1 generación aleatoria.
  *
  * @return el número aleatorio.
  */
export function get1() {
	let res1 = Math.abs(random_seed2 >> 16) % SIZE;
	let res2 = Math.abs(random_seed2 << 16) % SIZE;
	random_seed2 = Math.abs(res1 + res2) % SIZE;
	random_seed2 = Math.abs(random_seed2 + random_seed1) % SIZE;
	random_seed1 = Math.abs(random_seed1 + random_seed2) % SIZE;
	
	return random_seed2 / SIZE;
}

/**
  * Función para establecer una nueva semilla en el algoritmo #1.
  *
  * @param newSeed la nueva semilla.
  */
export function setSeed1(newSeed) {
	// Permitir que se puedan usar 
	if (newSeed >= 0 && newSeed <= 1) {
		newSeed *= SIZE;
	}
	
	// Capar valores decimales.
	if (newSeed == Math.floor(newSeed)) {
		newSeed += (newSeed - Math.floor(newSeed)) * SIZE;
	}
	
	// Capar número.
	newSeed = Math.abs(Math.floor(newSeed));
	newSeed %= SIZE;
	
	random_seed1 = newSeed ^ 0x3432;
	random_seed2 = newSeed;
}

/**
  * Algoritmo #2 generación aleatoria.
  *
  * @return el número aleatorio.
  */
export let rnd = Math.floor(Math.random() * 65535);
export function get2() {
	rnd = (rnd * 7919 + 1) & 0xFFFF;
	return rnd / 65535;
}


/**
  * Función para establecer una nueva semilla en el algoritmo #1.
  *
  * @param newSeed la nueva semilla.
  */
export function setSeed2(newSeed) {
	// Permitir que se puedan usar 
	if (newSeed >= 0 && newSeed <= 1) {
		newSeed *= 65535;
	}
	
	// Capar valores decimales.
	if (newSeed == Math.floor(newSeed)) {
		newSeed += (newSeed - Math.floor(newSeed)) * 65535;
	}
	
	newSeed = Math.abs(newSeed);
	newSeed &= 0xFFFF;
	
	rnd = newSeed;
}
