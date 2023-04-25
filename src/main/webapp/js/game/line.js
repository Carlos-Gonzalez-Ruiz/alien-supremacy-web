/**
  * Módulo de línea.
  * Usar este módulo para instanciar lineas en el escenario.
  */

import * as THREE from '/js/libs/three.module.js';

import * as graphics from '/js/graphics/graphics.js';

import * as galaxy from '/js/game/scene/galaxy.js';

/** Material de las líneas. */
let material;
/** Geometry de las lineas. */
export let geometry;
/** Mesh de las lineas. */
export let mesh;

/** Lista de referencias de líneas. */
export let ids = [];
/** Lista de vertices. */
let vertices = [];
/** Lista de indices. */
let indices = [];
/** Lista de colores. */
let colors = [];

/** Lista de referencias de estrella. */
let starRefs = [];
/** Lista de referencias de colores. */
let colorRefs = [];

/** Escenatio del módulo */
let scene;

/**
  * Función de inicialización del módulo.
  *
  * @param newScene escenario en dónde se añadirán las líneas.
  */
export function init(newScene) {
	scene = newScene;
	
	material = new THREE.LineBasicMaterial(
		{
			color: 0xFFFFFF,
			vertexColors: true
		}
	);
	
	geometry = new THREE.BufferGeometry();
	
	mesh = new THREE.LineSegments(geometry, material);
	mesh.frustumCulled = false;
	scene.add(mesh);
}

/**
  * Función de bucle del módulo.
  */
export function update() {
	if (geometry.attributes.position != undefined) {
		let positions = geometry.attributes.position.array;
		
		for (let i = 0, v = 0; i < starRefs.length; ) {
			let prevData = starRefs[i++];
			let data = starRefs[i++];
			
			if (prevData != undefined && data != undefined) {
				let pos1 = graphics.vertexCoordsToWorldCoords(galaxy.starMeshes[prevData.armIndex], prevData.index);
				let pos2 = graphics.vertexCoordsToWorldCoords(galaxy.starMeshes[data.armIndex], data.index);
				
				positions[v++] = pos1.x;
				positions[v++] = pos1.y;
				positions[v++] = pos1.z;
				
				positions[v++] = pos2.x;
				positions[v++] = pos2.y;
				positions[v++] = pos2.z;
			}
		}
		
		geometry.attributes.position.needsUpdate = true;
	}
	
	if (geometry.attributes.color != undefined) {
		let colors = geometry.attributes.color.array;
		
		for (let i = 0, v = 0; v < colors.length; ++i) {
			colors[v++] = colorRefs[i].x;
			colors[v++] = colorRefs[i].y;
			colors[v++] = colorRefs[i].z;
			
			colors[v++] = colorRefs[i].x;
			colors[v++] = colorRefs[i].y;
			colors[v++] = colorRefs[i].z;
		}
		
		geometry.attributes.color.needsUpdate = true;
	}
}

/**
  * Fúncion para añadir una línea al escenario.
  *
  * @param pos1 las coordenadas Vector3 1.
  * @param pos2 las coordenadas Vector3 2.
  * @param color los colores de la línea. (Ej.: new THREE.Vector3(1, 1, 1))
  * @return índice de la línea añadida.
  */
let inc = 0;
export function add(pos1, pos2, color) {
	let index = vertices.length / 6;
	ids.push(
		{
			key: inc,
			value: index
		}
	);
	console.log(ids);
	
	// Eliminar antiguos datos.
	geometry.dispose();
	scene.remove(mesh);
	
	// Añadir nuevos vertices, colores e índices.
	vertices.push(pos1.x, pos1.y, pos1.z);
	vertices.push(pos2.x, pos2.y, pos2.z);
	
	colors.push(color.x, color.y, color.z);
	colors.push(color.x, color.y, color.z);
	
	indices.push(index * 2);
	indices.push(index * 2 + 1);
	
	starRefs.push(null);
	starRefs.push(null);
	colorRefs.push(color);
	
	// Crear nueva geometria con los datos.
	let typesVertices = new THREE.Float32BufferAttribute(vertices, 3);
	let typesColor = new THREE.Float32BufferAttribute(colors, 3);
	
	geometry = new THREE.BufferGeometry();
	geometry.setAttribute("position", typesVertices);
	geometry.setAttribute("color", typesColor);
	geometry.setIndex(indices);
	
	// Crear nuevo mesh.
	mesh = new THREE.LineSegments(geometry, material);
	scene.add(mesh);
	
	return inc;
}

/**
  * Fúncion para añadir una línea al escenario mediante datos de estrella.
  *
  * @param prevData los datos de la estrella anterior.
  * @param data los datos de la nueva estrella.
  * @param color los colores de la línea. (Ej.: new THREE.Vector3(1, 1, 1))
  * @return índice de la línea añadida.
  */
export function addFromStarData(prevData, data, color) {
	let index = vertices.length / 6;
	ids.push(
		{
			key: inc,
			value: index
		}
	);
	
	// Eliminar antiguos datos.
	geometry.dispose();
	scene.remove(mesh);
	
	// Añadir nuevos vertices, colores e índices.
	vertices.push(0, 0, 0);
	vertices.push(0, 0, 0);
	
	colors.push(color.x, color.y, color.z);
	colors.push(color.x, color.y, color.z);
	
	indices.push(index * 2);
	indices.push(index * 2 + 1);
	
	starRefs.push(prevData);
	starRefs.push(data);
	colorRefs.push(color);
	
	// Crear nueva geometria con los datos.
	let typesVertices = new THREE.Float32BufferAttribute(vertices, 3);
	let typesColor = new THREE.Float32BufferAttribute(colors, 3);
	
	geometry = new THREE.BufferGeometry();
	geometry.setAttribute("position", typesVertices);
	geometry.setAttribute("color", typesColor);
	geometry.setIndex(indices);
	
	// Crear nuevo mesh.
	mesh = new THREE.LineSegments(geometry, material);
	scene.add(mesh);
	
	return inc++;
}

/**
  * Función para eliminar una línea del escenario.
  *
  * @param index el índice de la línea a eliminar.
  */
export function remove(index) {
	let removeIndex = ids.find(element => element.key == index).value;
	
	if (removeIndex != null) {
		// Eliminar antiguos datos.
		geometry.dispose();
		scene.remove(mesh);
		
		// Añadir nuevos vertices, colores e índices.
		vertices.splice(removeIndex * 6, 6);
		colors.splice(removeIndex * 6, 6);
		indices.splice(removeIndex * 2, 2);
		starRefs.splice(removeIndex * 2, 2);
		colorRefs.splice(removeIndex, 1);
		ids[ids.findIndex(element => element.key == index)].value = null;
		//ids.splice(ids.findIndex(element => element.key == index), 1);
		
		// Decrementar indices de los ids.
		for (let i = 0; i < ids.length; ++i) {
			if (ids[i].value != null && ids[i].value > removeIndex) {
				--ids[i].value;
			}
		}
		
		// Decrementar indices del array de indices.
		for (let i = 0; i < indices.length; ++i) {
			if (indices[i] > removeIndex * 2) {
				indices[i] -= 2;
			}
		}
		
		// Crear nueva geometria con los datos.
		let typesVertices = new THREE.Float32BufferAttribute(vertices, 3);
		let typesColor = new THREE.Float32BufferAttribute(colors, 3);
		
		geometry = new THREE.BufferGeometry();
		geometry.setAttribute("position", typesVertices);
		geometry.setAttribute("color", typesColor);
		geometry.setIndex(indices);
		
		// Crear nuevo mesh.
		mesh = new THREE.LineSegments(geometry, material);
		scene.add(mesh);
	}
}


/**
 * Función para liberar de la memoria del módulo.
 */
export function destroy() {
	material.dispose();
	geometry.dispose();
	scene.remove(mesh);	
}
