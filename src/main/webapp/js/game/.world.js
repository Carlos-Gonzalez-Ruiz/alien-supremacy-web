/**
  * Módulo de mundo.
  * Este módulo se encarga de trabajar con el mundo.
  */

import * as THREE from '/js/libs/three.module.js';

import * as game from '/js/game/game.js';
import * as graphics from '/js/graphics/graphics.js';
import * as keyboard from '/js/keyboard/keyboard.js';

import * as player from '/js/game/player.js';

/** Texture por defecto del mundo. */
let texture;
/** Modelo del mundo. */
let geometry;
/** Shader del mundo */
let material;
/** Mesh del mundo. */
let worldMesh;

/** Texture por defecto del mundo. */
let localTexture;
/** Modelo del mundo. */
let localGeometry;
/** Shader del mundo */
let localMaterial;
/** Mesh local para las colisiones. */
export let localWorldMesh;

/** Posición local X en el mapa. */
let localPosX = 0;
/** Posición local Y (Z) en el mapa. */
let localPosY = 0;

/** Color de la atmósfera. */
let atmosphereColor = 0xAAAAFF;
/** Densidad de la atmósfera. */
let atmosphereDensity = 0.004;

/** Colinas. */
let hills = [];

/** Estrella principal. */
export let sun;

/** Tamaño del terreno. */
const SIZE = 100;
/** Resolución del terreno. */
const CELLS = SIZE / 10; // Se recomienda usar números múltiplos de SIZE
/** Tamaño límite del terreno local. */
const LOCAL_SIZE_LIMIT = 100;
/** Proporción del terreno local. */
const LOCAL_PROPORTION = SIZE / LOCAL_SIZE_LIMIT;
/** Tamaño del terreno local. */
const LOCAL_SIZE = SIZE / LOCAL_PROPORTION;
/** Resolución del terreno local. */
const LOCAL_CELLS = CELLS / LOCAL_PROPORTION; // Se recomienda usar números múltiplos de SIZE
/** Tamaño de resolución. */
const CELL_SIZE = SIZE / CELLS;
/** Número de colinas. */
const HILL_COUNT = 10;

/**
  * Función de inicialización del módulo.
  */
export function init() {
	// Representación del mundo.
	texture = new THREE.TextureLoader().load('/image/earthgrass.png');
	texture.minFilter = texture.magFilter = graphics.filtering;
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	texture.repeat = new THREE.Vector2(CELLS * 2, CELLS);
	
	geometry = new THREE.PlaneGeometry(100, 100, 20, 20);
	material = new THREE.MeshLambertMaterial( { color: 0xFFFFFF, map: texture } );
	worldMesh = new THREE.Mesh(geometry, material);
	
	worldMesh.position.x = 0;
	worldMesh.position.y = 0;
	worldMesh.position.z = 0;
	
	worldMesh.castShadow = true;
	worldMesh.receiveShadow = true;
	
	graphics.currentScene.add(worldMesh);
	
	// Terrona local.
	localTexture = new THREE.TextureLoader().load('/image/water.png');
	localTexture.minFilter = localTexture.magFilter = graphics.filtering;
	localTexture.wrapS = localTexture.wrapT = THREE.RepeatWrapping;
	localTexture.repeat = new THREE.Vector2(LOCAL_CELLS * 2, LOCAL_CELLS);
	
	localGeometry = new THREE.PlaneGeometry(25, 25, 5, 5);
	localMaterial = new THREE.MeshBasicMaterial( { color: 0x00FF00, map: localTexture } );
	localWorldMesh = new THREE.Mesh(localGeometry, localMaterial);
	
	localWorldMesh.position.x = 0;
	localWorldMesh.position.y = 0;
	localWorldMesh.position.z = 0;
	
	graphics.currentScene.add(localWorldMesh);
	
	// Regenerar terreno.
	generateHills();
	regenerateTerrain();
	regenerateLocalTerrain();
	
	// Sol.
	let light1 = new THREE.AmbientLight(0x303030);
	graphics.currentScene.add(light1);
	
	sun = new THREE.SpotLight(0xFFFFFF, 1, 0, Math.PI / 1, 0.75);
	sun.position.set(0, SIZE, 0);
	sun.castShadow = true;
	sun.shadow.mapSize.width = 4096;
	sun.shadow.mapSize.height = 4096;
	sun.shadow.camera.near = 0.5;
	sun.shadow.camera.far = 1000;
	sun.shadow.bias = 0.0001;
	graphics.currentScene.add(sun);
	
	// Atmósfera.
	graphics.renderer.setClearColor(new THREE.Color(atmosphereColor));
	graphics.currentScene.fog = new THREE.FogExp2(atmosphereColor, atmosphereDensity);
}

/**
  * Función de bucle del módulo.
  */
export function update() {
	// Regenerar terreno.
	if (keyboard.checkPressedOnce('R')) {
		generateHills();
		regenerateTerrain();
		regenerateLocalTerrain();
	}
	
	// Actualizar terreno local en función de la posición.
	let prevLocalPosX = localPosX;
	let prevLocalPosY = localPosY;
	
	localPosX = (player.posX - player.posX % CELL_SIZE);
	localPosY = (player.posZ - player.posZ % CELL_SIZE);
	
	if (localPosX != prevLocalPosX || localPosY != prevLocalPosY) {
		regenerateLocalTerrain();
	}
	
	// Funcionamento del sol.
	//sun.position.x += 3;
}

/**
 * Función para liberar de la memoria los datos del mundo.
 */
export function destroy() {
	// Representación gráfica.
	texture.dispose();
	geometry.dispose();
	material.dispose();
	graphics.currentScene.remove(worldMesh);
	
	sun.dispose();
	graphics.currentScene.remove(sun);	
}

/**
  * Función para generar las colinas.
  */
function generateHills() {
	for (let i = 0; i < HILL_COUNT; ++i) {
		hills[i] = {
			x: -(SIZE) + Math.random() * SIZE * 2,
			y: -(SIZE / 2) + Math.random() * SIZE,
			height: -100 * Math.random() + Math.random() * 50,
			radius: 50 + Math.random() * 400
		};
	}
}

/**
  * Función para la regeneración del terreno.
  */
function regenerateTerrain() {
	// Limpiar memoria.
	geometry.dispose();
	graphics.currentScene.remove(worldMesh);
	
	geometry = new THREE.PlaneGeometry(SIZE * 2, SIZE, CELLS * 2, CELLS);
	let positions = geometry.getAttribute('position');
	let vertex = new THREE.Vector3();
	
	for (let i = 0; i < positions.count; ++i) {
		vertex.fromBufferAttribute(positions, i);
		
		let posX = vertex.x;
		let posY = vertex.y;
		let posZ = vertex.z;
		
		// Aplicar colinas.
		for (let u = 0; u < HILL_COUNT; ++u) {
			let deltaX = vertex.x + hills[u].x;
			let deltaY = vertex.y + hills[u].y;
			
			let distance = Math.sqrt(
				deltaX * deltaX +
				deltaY * deltaY
			);
			
			if (distance < hills[u].radius) {
				posX += 0;
				posY += 0;
				posZ += vertex.z + ((hills[u].radius - distance) / hills[u].radius) * hills[u].height;
			}
		}
		
		positions.setXYZ(
			i,
			-posX,
			posZ,
			posY
		);
	}
	
	geometry.computeVertexNormals();
	geometry.normalizeNormals();
	
	// Añadir al escenario.
	worldMesh = new THREE.Mesh(geometry, material);
	worldMesh.position.x = 0;
	worldMesh.position.y = 0;
	worldMesh.position.z = 0;
	
	worldMesh.castShadow = true;
	worldMesh.receiveShadow = true;
	
	graphics.currentScene.add(worldMesh);
}

/**
  * Función para la regeneración del terreno local.
  */
function regenerateLocalTerrain() {
	// Limpiar memoria.
	localGeometry.dispose();
	graphics.currentScene.remove(localWorldMesh);
	
	localGeometry = new THREE.PlaneGeometry(LOCAL_SIZE * 2, LOCAL_SIZE, LOCAL_CELLS * 2, LOCAL_CELLS);
	let positions = localGeometry.getAttribute('position');
	let vertex = new THREE.Vector3();
	
	// Procesar colinas.
	for (let i = 0; i < positions.count; ++i) {
		vertex.fromBufferAttribute(positions, i);
		
		let posX = vertex.x;
		let posY = vertex.y;
		let posZ = vertex.z;
		
		// Aplicar colinas.
		for (let u = 0; u < HILL_COUNT; ++u) {
			let deltaX = vertex.x + hills[u].x - localPosX;
			let deltaY = vertex.y + hills[u].y + localPosY;
			
			let distance = Math.sqrt(
				deltaX * deltaX +
				deltaY * deltaY
			);
			
			if (distance < hills[u].radius) {
				posX += 0;
				posY += 0;
				posZ += vertex.z + ((hills[u].radius - distance) / hills[u].radius) * hills[u].height;
			}
		}
		
		positions.setXYZ(
			i,
			-posX,
			posZ,
			posY
		);
	}
	
	// Añadir al escenario.
	localWorldMesh = new THREE.Mesh(localGeometry, localMaterial);
	localWorldMesh.position.x = localPosX;
	localWorldMesh.position.y = 0;
	localWorldMesh.position.z = localPosY;
	
	graphics.currentScene.add(localWorldMesh);
	
	localWorldMesh.visible = false;
}
