/**
  * Módulo para el mostrado de efecto de viaje entre estrellas.
  */

import * as THREE from '/proyecto-fin-ciclo/js/libs/three.module.js';

import * as graphics from '/proyecto-fin-ciclo/js/graphics/graphics.js';

import * as galaxy from '/proyecto-fin-ciclo/js/game/scene/galaxy.js';
import * as galaxyControl from '/proyecto-fin-ciclo/js/game/scene/galaxy-control.js';

/** Material de las líneas.  */
let lineMaterial;
/** Geometries de las líneas. */
let lineGeometries = [];
/** Meshes de las líneas. */
let lineMeshes = [];

/** Velocidades de las líneas. */
let lineSpeeds = [];
/** Factor de velocidad de las líneas. */
export let lineSpeedFactor = 0;

/** Grupo de objetos del efecto. */
export let effectGroup = new THREE.Group();

/** Número de líneas. */
const LINE_MAX = 10;
/** Líneas por línea. */
const LINES_PER_LINE = 50;
/** Dimensiones. */
const DIMENSION = 500;
/** Longitud máxima de la línea. */
const LINE_LENGTH = 150;
/** Distancia máxima. */
const DISTANCE_MAX = 5000;
/** Velocidad mímina. */
const SPEED_MIN = 10;
/** Velocidad máxima. */
const SPEED_MAX = 30;

/**
  * Función de inicialización del módulo.
  */
export function init() {
	lineMaterial = new THREE.LineBasicMaterial({
		color: 0xFFFFFF,
		vertexColors: true
	});
	
	for (let i = 0; i < LINE_MAX; ++i) {
		let vertices = [];
		let colors = [];
		let indices = [];
		
		for (let u = 0; u < LINES_PER_LINE; ++u) {
			let x = Math.random() * DIMENSION * 4 - DIMENSION * 2;
			let y = Math.random() * DIMENSION * 2 - DIMENSION;
			let z = -DISTANCE_MAX / 2 + Math.random() * DIMENSION * 2 - DIMENSION;
			vertices.push(x, y, z + Math.random() * LINE_LENGTH);
			vertices.push(x, y, z + Math.random() * LINE_LENGTH);
			
			//colors.push(Math.random(), Math.random(), Math.random());
			//colors.push(Math.random(), Math.random(), Math.random());
			colors.push(1, 1, 1);
			colors.push(1, 1, 1);
			
			indices.push(u * 2, u * 2 + 1);
		}
		
		let typesVertices = new THREE.Float32BufferAttribute(vertices, 3);
		let typesColor = new THREE.Float32BufferAttribute(colors, 3);
		
		let geometry = new THREE.BufferGeometry();
		geometry.setAttribute("position", typesVertices);
		geometry.setAttribute("color", typesColor);
		geometry.setIndex(indices);
		
		let mesh = new THREE.LineSegments(geometry, lineMaterial);
		// Establecer posición aleatoria.
		mesh.position.z = Math.random() * DISTANCE_MAX;
		
		lineGeometries.push(geometry);
		lineMeshes.push(mesh);
		effectGroup.add(mesh);
		
		// Añadir velocidades.
		lineSpeeds.push(SPEED_MIN + Math.random() * SPEED_MAX);
	}
	
	// Añadir a la escena.
	galaxy.view.scene.add(effectGroup);
	
	effectGroup.visible = false;
}

/**
  * Función de bucle del módulo.
  */
export function update() {
	// Solo realizar animación si es visible el grupo.
	if (effectGroup.visible) {
		lineMaterial.color.r = Math.min(lineSpeedFactor / (DISTANCE_MAX / 100), 0.65);
		lineMaterial.color.g = Math.min(lineSpeedFactor / (DISTANCE_MAX / 100), 0.65);
		lineMaterial.color.b = Math.min(lineSpeedFactor / (DISTANCE_MAX / 100), 0.65);
		
		for (let i = 0; i < LINE_MAX; ++i) {
			lineMeshes[i].position.z -= lineSpeeds[i] * lineSpeedFactor;
			if (lineMeshes[i].position.z < 0) {
				lineMeshes[i].position.z += DISTANCE_MAX;
			}
		}
	}
}

/**
 * Función para liberar de la memoria del módulo.
 */
export function destroy() {
	// Eliminar líneas.
	lineMaterial.dipose();
	for (let i = 0; i < LINE_MAX; ++i) {
		lineGeometries[i].dipose();
		lineMeshes[i].dipose();
	}
	
	// Eliminar grupo.
	galaxy.view.scene.remove(effectGroup);
}

/**
  * Settter lineSpeedFactor.
  *
  * @param value el nuevo valor.
  */
export function setLineSpeedFactor(value) {
	lineSpeedFactor = value;
}
