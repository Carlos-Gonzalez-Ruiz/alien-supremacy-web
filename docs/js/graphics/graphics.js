/**
  * Módulo de gestión de gráficos.
  */

import * as THREE from './js/libs/three.module.js';

import * as game from './js/game/game.js';

/** Relación de aspecto. */
export let aspectRatio = 1;
/** Campo de visión. */
export let fov = 110; 
/** Z near. */
export let zNear = 0.1;
/** Z far. */
export let zFar = 1000;
/** Suavizado de texturas por defecto. */
export let filtering = /*THREE.NearestFilter;*/ THREE.LinearFilter;

/** Canvas del renderizado. */
export let canvas = document.getElementById('graphics');

/** WebGL renderer. */
export let renderer;

/** Escena base */
export let currentScene;
/** Camera de la escena base */
export let camera;
/** Dirección X de la cámara. */
export let dirX = 0;
/** Dirección Y de la cámara. */
export let dirY = 0;

/** Lista de vistas. */
export let views = [];

/**
  * Función de inicialización del módulo.
  */
export function init() {
	// Establecer tamaño del canvas.
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	
	// Crear renderer.
	renderer = new THREE.WebGLRenderer({
		antialias: true,
		canvas: canvas //canvas: undefined
	});
	renderer.autoClear = false;
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	
	// Cámara base.
	camera = new THREE.Object3D();
	
	// Viewport.
	updateViewport();
	document.body.appendChild(renderer.domElement);
	window.addEventListener('resize', function() {
		updateViewport();
	});
	
	// Escenario.
	currentScene = new THREE.Scene();
}

/**
  * Función para crear una nueva vista de renderizado.
  *
  * @param clearDepth vaciar z-buffer al renderizar escena.
  * @param onUpdate lambda / función para realizar acciones cuando se realiza una actualización de cámara.
  * @return la nueva vista.
  */
export function createView(clearDepth, onUpdate) {
	let view = {
		scene: new THREE.Scene(),
		camera: new THREE.PerspectiveCamera(fov, canvas.width / canvas.height, zNear, zFar),
		prevCameraPos: new THREE.Vector3(0, 0, 0),
		prevCameraRot: new THREE.Vector3(0, 0, 0),
		onCameraUpdate: onUpdate,
		triggerCameraUpdate: false
	};
	
	view.scene.autoClear = false;
	view.scene.autoClearColor = true;
	view.scene.autoClearDepth = clearDepth;
	view.scene.autoClearStencil = true;
	
	views.push(view);
	
	return view;
}

/**
  * Función para abstraer el actualizado del viewport.
  */
export function updateViewport() {
	console.log("update viewport");
	
	// Establecer tamaño del canvas.
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	
	// Tamaño del viewport.
	renderer.setSize(canvas.width, canvas.height);
	
	// Actualizar relación de aspecto.
	aspectRatio = canvas.width / canvas.height;
	
	for (let i = 0; i < views.length; ++i) {
		// Guardar valores anteriores.
		let positionX = 0;
		let positionY = 0;
		let positionZ = 0;
		
		let rotationX = 0;
		let rotationY = 0;
		let rotationZ = 0;
		
		if (views[i].camera != undefined) {
			positionX = views[i].camera.position.x;
			positionY = views[i].camera.position.y;
			positionZ = views[i].camera.position.z;
			
			rotationX = views[i].camera.rotation.x;
			rotationY = views[i].camera.rotation.y;
			rotationZ = views[i].camera.rotation.z;
		}
		
		// Camara.
		views[i].camera = new THREE.PerspectiveCamera(fov, aspectRatio, zNear, zFar);
		
		// Aplicar valores anteriores.
		views[i].camera.position.x = positionX;
		views[i].camera.position.y = positionY;
		views[i].camera.position.z = positionZ;
		
		views[i].camera.setRotationFromEuler(camera.rotation);
		
		// Indicar que debe ser actualizado.
		views[i].triggerCameraUpdate = true;
	}
}

/**
  * Función de renderizado de la escena.
  */
export function render() {
	renderer.clear(true, true, true);
	
	for (let i = 0; i < views.length; ++i) {
		// Solo renderizar aquellos que estén al nivel.
		if (i <= game.viewLevel) {
			// Aplicar rotacion XYZ
			views[i].camera.setRotationFromEuler(new THREE.Euler(dirX, dirY, 0, 'YXZ'));
			//views[i].camera.setRotationFromEuler(camera.rotation);
			renderer.render(views[i].scene, views[i].camera);
			
			// Procesar actualización de la cámara.
			let accuracy = 100; // Hacer que sea más insensible al movimiento.
			
			let positionX = Math.floor(views[i].camera.position.x * accuracy);
			let positionY = Math.floor(views[i].camera.position.y * accuracy);
			let positionZ = Math.floor(views[i].camera.position.z * accuracy);
			
			let rotationX = Math.floor(views[i].camera.rotation.x * accuracy);
			let rotationY = Math.floor(views[i].camera.rotation.y * accuracy);
			let rotationZ = Math.floor(views[i].camera.rotation.z * accuracy);
			
			if (	views[i].triggerCameraUpdate ||
				
				views[i].prevCameraRot.x != rotationX || 
				views[i].prevCameraRot.y != rotationY || 
				views[i].prevCameraRot.z != rotationZ || 
				
				views[i].prevCameraPos.x != positionX || 
				views[i].prevCameraPos.y != positionY || 
				views[i].prevCameraPos.z != positionZ) {

				// Actualizar cámara.				
				if (views[i].onCameraUpdate != undefined) {
					views[i].onCameraUpdate();
				}
				views[i].triggerCameraUpdate = false;
				
				// Guardar datos anteriores.
				views[i].prevCameraRot.x = rotationX;
				views[i].prevCameraRot.y = rotationY;
				views[i].prevCameraRot.z = rotationZ;
				
				views[i].prevCameraPos.x = positionX;
				views[i].prevCameraPos.y = positionY;
				views[i].prevCameraPos.z = positionZ;
			}
		}
	}
}

/**
  * Función útil para convertir coordenadas reales a coordenadas de la pantalla.
  *
  * @param viewCamera la cámara.
  * @param coordinates las coordenadas a transformar.
  * @return un Vector3 con las coordenadas de pantalla.
  */
export function realCoordsToScreenCoords(viewCamera, coordinates) {
	let width = canvas.width;
	let height = canvas.height;
	
	let widthHalf = width / 2;
	let heightHalf = height / 2;
	
	let pos = coordinates.clone();
	pos.project(viewCamera);
	pos.x = (pos.x * widthHalf) + widthHalf;
	pos.y = -(pos.y * heightHalf) + heightHalf;
	
	// No mostrar si está por detrás.
	if (pos.z < 0 || pos.z > 1) {
		pos.x += width * Math.sign(pos.x);
		pos.y += height * Math.sign(pos.y);
	}
	
	return pos;
}

/**
 * Función útil para convertir coordenadas de un vértice a coordenadas de mundo.
 *
 * @param object el objeto.
 * @param index el índice del vértice.
 * @return las coordenadas transformadas.
 */
export function vertexCoordsToWorldCoords(object, index) {
	let vertex = new THREE.Vector3();
	
	vertex.fromBufferAttribute(object.geometry.getAttribute('position'), index);
	object.localToWorld(vertex);
	
	return vertex;
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
