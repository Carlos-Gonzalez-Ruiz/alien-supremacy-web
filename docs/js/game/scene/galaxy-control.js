/**
  * Módulo de control de galaxia.
  */

import * as THREE from '/proyecto-fin-ciclo/js/libs/three.module.js';

import * as gameConstants from '/proyecto-fin-ciclo/js/constants/game-constants.js';
import * as keyboardConstants from '/proyecto-fin-ciclo/js/constants/keyboard-constants.js';

import * as graphics from '/proyecto-fin-ciclo/js/graphics/graphics.js';
import * as keyboard from '/proyecto-fin-ciclo/js/keyboard/keyboard.js';

import * as game from '/proyecto-fin-ciclo/js/game/game.js';

import * as line from '/proyecto-fin-ciclo/js/game/line.js';

import * as galaxy from '/proyecto-fin-ciclo/js/game/scene/galaxy.js';
import * as galaxyControlUi from '/proyecto-fin-ciclo/js/game/scene/galaxy-control-ui.js';
import * as galaxyEffectTravel from '/proyecto-fin-ciclo/js/game/scene/galaxy-effect-travel.js'

import * as starSystem from '/proyecto-fin-ciclo/js/game/scene/starsystem.js';
import * as starSystemControl from '/proyecto-fin-ciclo/js/game/scene/starsystem-control.js';

/** Raycaster. */
let raycaster;
/** Pointer del raycaster. */
let raycasterPointer = new THREE.Vector2(0, 0);

/** Estrella dónde se ha posado el ratón. */
export let hoveredStar = -1;
/** Brazo dónde se ha posado el ratón. */
export let hoveredArm = -1;
/** Estrella seleccionada. */
export let selectedStar = -1;
/** Posición de la estrella seleccionada anteriormente. */
let selectedStarPrevPos = new THREE.Vector3();
/** Indicar tiempo máximo de selección para hacer doble-click. (milisegundos) */
let selectedStarTimestampMax = 500;
/** Indicar tiempo límite de selección para hacer doble-click. (milisegundos) */
let selectedStarTimestampLimit = 0;
/** Brazo seleccionada. */
export let selectedArm = -1;

/** Textura de apuntado. */
let hoverStarTexture;
/** Material de apuntado. */
let hoverStarMaterial;
/** Geometry de apuntado. */
let hoverStarGeometry;
/** Mesh de apuntado. */
export let hoverStarMesh;

/** Textura de selección. */
let selectedStarTexture;
/** Material de selección. */
let selectedStarMaterial;
/** Geometry de selección. */
let selectedStarGeometry;
/** Mesh de selección. */
export let selectedStarMesh;

/** Textura de puntero. */
let pointerTexture;
/** Material de puntero. */
let pointerMaterial;
/** Geometry de puntero. */
let pointerGeometry;
/** Mesh de puntero. */
export let pointerMesh;

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
let distanceMax = 450;
/** Aplica suavizado al cambio de distancia de la caḿara. */
let distanceSpeed = 0;
/** Sensibilidad a la rueda del ratón. */
let distanceSpeedFactor = 4;
/** Aplica suavizado al dejar de cambiar de distancia de la caḿara. */
let distanceDeacc = 1.5;

/** Histórico de estrellas visitadas. */
export let visitedStars = [];
/** Histórico de estrellas visitadas en índices de líneas. */
export let visitedStarsLines = [];
/** Colores del histórico de estrellas visitidas. */
export let visitedStarsLinesColors = [];
/** Capacidad máxima del histórico de estrellas visitadas. */
export let visitedStarsCapacity = 5;
/** Posición actual del histórico de estrellas visitadas. */
export let visitedStarsPos = 0;

/**
  * Función de inicialización del módulo.
  */
export function init() {
	// Raycaster.
	raycaster = new THREE.Raycaster();
	raycaster.params.Points.threshold = 0.5;
	
	initHoverStar();
	initSelectedStar();
	initPointer();
	initVisitedStar();
	
	galaxyControlUi.init();
}

/**
  * Función de inicialización de apuntado.
  */
function initHoverStar() {
	// Textura.
	hoverStarTexture = new THREE.TextureLoader().load('/proyecto-fin-ciclo/image/round-select.png');
	hoverStarTexture.wrapS = hoverStarTexture.wrapT = THREE.ClampToEdgeWrapping;
	hoverStarTexture.minFilter = hoverStarTexture.magFilter = THREE.LinearFilter;
	
	// Material.
	hoverStarMaterial = new THREE.PointsMaterial(
		{
			color: 0xCCCCCC,
			map: hoverStarTexture,
			blending: THREE.AdditiveBlending,
			depthTest: false,
			transparent: true
		}
	);
	// Geometría.
	hoverStarGeometry = new THREE.BufferGeometry();
	hoverStarGeometry.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0], 3));
	// Mesh.
	hoverStarMesh = new THREE.Points(hoverStarGeometry, hoverStarMaterial);
	
	// Añadir a la escena.
	galaxy.view.scene.add(hoverStarMesh);
}

/**
  * Función de inicialización de selección.
  */
function initSelectedStar() {
	// Textura.
	selectedStarTexture = new THREE.TextureLoader().load('/proyecto-fin-ciclo/image/round-select.png');
	selectedStarTexture.wrapS = selectedStarTexture.wrapT = THREE.ClampToEdgeWrapping;
	selectedStarTexture.minFilter = selectedStarTexture.magFilter = THREE.LinearFilter;
	
	// Material.
	selectedStarMaterial = new THREE.PointsMaterial(
		{
			color: 0xFFFFFF,
			map: hoverStarTexture,
			blending: THREE.AdditiveBlending,
			depthTest: false,
			transparent: true
		}
	);
	// Geometría.
	selectedStarGeometry = new THREE.BufferGeometry();
	selectedStarGeometry.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0], 3));
	// Mesh.
	selectedStarMesh = new THREE.Points(selectedStarGeometry, selectedStarMaterial);
	
	// Añadir a la escena.
	galaxy.view.scene.add(selectedStarMesh);
}

/**
  * Función de inicialización de puntero.
  */
function initPointer() {
	// Textura.
	pointerTexture = new THREE.TextureLoader().load('/proyecto-fin-ciclo/image/galaxy-pointer.png');
	pointerTexture.wrapS = pointerTexture.wrapT = THREE.ClampToEdgeWrapping;
	pointerTexture.minFilter = pointerTexture.magFilter = THREE.LinearFilter;
	
	// Material.
	pointerMaterial = new THREE.MeshBasicMaterial(
		{
			color: 0x888888,
			map: pointerTexture,
			blending: THREE.AdditiveBlending,
			depthTest: false,
			transparent: true,
			side: THREE.DoubleSide
		}
	);
	// Geometría.
	pointerGeometry = new THREE.PlaneGeometry(1, 1);
	// Mesh.
	pointerMesh = new THREE.Mesh(pointerGeometry, pointerMaterial);
	pointerMesh.rotation.x = Math.PI / 2;
	
	// Añadir a la escena.
	galaxy.view.scene.add(pointerMesh);
}

/**
  * Función de inicialización de línea de histórico.
  */
function initVisitedStar() {
	
}

/**
  * Función de bucle del módulo.
  */
export function update() {
	galaxyControlUi.update();
	
	// Solo permitir control en caso de que el nivel sea el adecuado.
	if (game.viewLevel == gameConstants.VIEW_LEVEL_GALAXY) {
		movement();
		camera();
	} else if (game.viewLevel == gameConstants.VIEW_LEVEL_STARSYSTEM) {
		 // Posicionar la cámara a la estrella actual.
		let vertex = graphics.vertexCoordsToWorldCoords(galaxy.starMeshes[starSystem.currentStar.armIndex], starSystem.currentStar.index);
		
		let x = vertex.x - galaxy.view.camera.position.x;
		let y = vertex.y - galaxy.view.camera.position.y;
		let z = vertex.z - galaxy.view.camera.position.z;
		
		let dst = Math.sqrt(x * x + y * y + z * z);
		if (dst > 0.25) { // Para cuando se llegue a cierto punto.
			let dstXZ = Math.sqrt(x * x + z * z);
			
			let dirX = Math.atan2(dstXZ, y);
			let dirY = Math.atan2(x, z);
			
			galaxy.view.camera.position.x += Math.sin(dirY) * dst / 5 * Math.sin(dirX);
			galaxy.view.camera.position.y += Math.cos(dirX) * dst / 5;
			galaxy.view.camera.position.z += Math.cos(dirY) * dst / 5 * Math.sin(dirX);
			
			starSystem.group.visible = false;
			
			// Efecto de viaje.
			galaxyEffectTravel.effectGroup.visible = true;
			galaxyEffectTravel.effectGroup.rotation.x = dirX - Math.PI / 2;
			galaxyEffectTravel.effectGroup.rotation.y = dirY;
			galaxyEffectTravel.setLineSpeedFactor(dst);
		} else {
			galaxy.view.camera.position.x = vertex.x;
			galaxy.view.camera.position.y = vertex.y;
			galaxy.view.camera.position.z = vertex.z;
			
			starSystem.group.visible = true;
			
			// Efecto de viaje.
			galaxyEffectTravel.effectGroup.visible = false;
		}
	}
	
	userInterface();
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
		galaxy.objectGroup.position.x += 1;
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
	galaxy.view.camera.position.x = posX - Math.sin(dirY) * Math.cos(dirX) * distance;
	galaxy.view.camera.position.y = posY + Math.sin(dirX) * distance;
	galaxy.view.camera.position.z = posZ - Math.cos(dirY) * Math.cos(dirX) * distance;
	
	// Aplicar rotacion XYZ
	graphics.setDirX(-dirX);
	graphics.setDirY(dirY - Math.PI);
}

/**
  * Función para todo lo relativo a temas de interfaz de usuario de manera general.
  */
function userInterface() {
	{ // Posar ratón sobre estrella.
		
		// Función para cuando ocurra una intersección-
		function intersectionOccurs(armIndex, index) {
			let vertex = graphics.vertexCoordsToWorldCoords(galaxy.starMeshes[armIndex], index);
			hoverStarMesh.visible = true;
			hoverStarMesh.position.x = vertex.x;
			hoverStarMesh.position.y = vertex.y;
			hoverStarMesh.position.z = vertex.z;
			
			// Mostrar datos de estrella.
			if ((hoveredArm != armIndex || hoveredStar != index) && (selectedArm != armIndex || selectedStar != index)) {
				galaxyControlUi.displayStarHoveredBox();
				
				hoveredStar = index;
				hoveredArm = armIndex;
			}
			
			// Seleccionar estrella.
			if (keyboard.checkMouseButtonPressedOnce(keyboardConstants.MB_LEFT)) {
				if (selectedArm != armIndex || selectedStar != index) {
					let vertex = graphics.vertexCoordsToWorldCoords(galaxy.starMeshes[armIndex], index);
					selectedStarMesh.visible = true;
					selectedStarMesh.position.x = vertex.x;
					selectedStarMesh.position.y = vertex.y;
					selectedStarMesh.position.z = vertex.z;
					
					// Dejar de mostrar caja de posar sobre estrella.
					hoveredStar = -1;
					hoveredArm = -1;
					galaxyControlUi.hideStarHoveredBox();
					
					// Mostrar caja de selección.
					galaxyControlUi.displayStarSelectedBox();
					
					selectedStar = index;
					selectedArm = armIndex;
					
					// Indicar tiempo en el que fue seleccionado.
					selectedStarTimestampLimit = Date.now() + selectedStarTimestampMax;
				} else if (Date.now() < selectedStarTimestampLimit) {
					// Comprobar si esta dentro del tiempo de selección.
					game.gotoStarSystemSave(galaxy.starData[selectedArm][selectedStar]);
				} else {
					// Deseleccionar al hacer click otra vez, si ha pasado el tiempo de selección.
					selectedStarMesh.visible = false;
					
					selectedStar = -1;
					selectedArm = -1;
					galaxyControlUi.hideStarSelectedBox();
				}
			}
		}
		
		// Función para cuando no ocurra una intersección-
		function noIntersectionOccurs() {
			hoverStarMesh.visible = false;
			
			// Dejar de mostrar datos de estrella.
			if (hoveredStar != -1) {
				hoveredStar = -1;
				hoveredArm = -1;
				galaxyControlUi.hideStarHoveredBox();
			}
			
			// Deseleccionar estrella.
			if (keyboard.checkMouseButtonPressedOnce(keyboardConstants.MB_LEFT) && selectedStar != -1) {
				selectedStarMesh.visible = false;
				
				selectedStar = -1;
				selectedArm = -1;
				galaxyControlUi.hideStarSelectedBox();
			}
		}
		
		// Comprobar intersecciones.
		let maxDistance = 100;
		let timeRate = 200;
		
		if (Math.floor(Date.now() / timeRate) % 1 == 0) {
			raycasterPointer.x = (keyboard.cursorPosX / graphics.canvas.width) * 2 - 1;
			raycasterPointer.y = - (keyboard.cursorPosY / graphics.canvas.height) * 2 + 1;
			raycaster.setFromCamera(raycasterPointer, galaxy.view.camera);
			raycaster.far = maxDistance;
			
			let intersections = raycaster.intersectObjects(galaxy.starMeshes, false);
			if (intersections.length > 0) {
				let armIndex = intersections[0].object.name;
				let index = intersections[0].index;
				
				// Si se está dentro de un sistema estelar, obtener siguiente intersección.
				if (game.viewLevel == gameConstants.VIEW_LEVEL_STARSYSTEM) {
					if (intersections.length > 1) {
						armIndex = intersections[1].object.name;
						index = intersections[1].index;
					} else {
						armIndex = null;
						index = null;
					}
				}
				
				if (armIndex != null && index != null) {
					intersectionOccurs(armIndex, index);
				} else {
					noIntersectionOccurs();
				}
			} else {
				noIntersectionOccurs();
			}
		}
		
		// Actalizar posción de la estrella de selección.
		if (selectedStar != -1 && selectedStarMesh.visible) {
			let vertex = graphics.vertexCoordsToWorldCoords(galaxy.starMeshes[selectedArm], selectedStar);
			
			// Actualizar UI en caso de movimiento.
			let accuracy = 100; // Hacer que sea más insensible al movimiento.
			
			let positionX = Math.floor(vertex.x * accuracy);
			let positionY = Math.floor(vertex.y * accuracy);
			let positionZ = Math.floor(vertex.z * accuracy);
			
			if (selectedStarPrevPos.x != positionX || selectedStarPrevPos.y != positionY || selectedStarPrevPos.z != positionZ) {
				// Actualizar cámara.
				cameraOnUpdate();
			}
			
			selectedStarMesh.position.x = vertex.x;
			selectedStarMesh.position.y = vertex.y;
			selectedStarMesh.position.z = vertex.z;
			
			selectedStarPrevPos.x = positionX;
			selectedStarPrevPos.y = positionY;
			selectedStarPrevPos.z = positionZ;
		} else if (selectedStar == -1 && selectedStarMesh.visible) { // Dejar de mostrar selección.
			selectedStarMesh.visible = false;
		}
	}
	
	{ // Puntero de posición.
		let size = 10;
		
		pointerMesh.position.x = posX;
		pointerMesh.position.y = posY - 10;
		pointerMesh.position.z = posZ;
		pointerMesh.scale.x = distance / size;
		pointerMesh.scale.y = distance / size;
		pointerMesh.scale.z = distance / size;
	}
}

/**
  * Callback de actualización cuando la cámara sea actualizada.
  */
export function cameraOnUpdate() {
	// Actualizar interfaz de usuario DOM.
	galaxyControlUi.cameraOnUpdate();
}

/**
 * Función para liberar de la memoria del módulo.
 */
export function destroy() {
	destroyHoverStar();
	destroySelectStar();
	destroyPointer();
	destroyVisitedStar();
}

/**
 * Función para liberar de la memoria la selección.
 */
function destroyHoverStar() {
	hoverStarTexture.dispose();
	hoverStarMaterial.dispose();
	hoverStarGeometry.dipose();
	galaxy.view.scene.remove(hoverStarMesh);
}

/**
 * Función para liberar de la memoria el apuntado.
 */
function destroySelectedStar() {
	selectedStarTexture.dispose();
	selectedStarMaterial.dispose();
	selectedStarGeometry.dipose();
	galaxy.view.scene.remove(selectedStarMesh);
}

/**
 * Función para liberar de la memoria el puntero.
 */
function destroyPointer() {
	pointerTexture.dispose();
	pointerMaterial.dispose();
	pointerGeometry.dipose();
	galaxy.view.scene.remove(pointerMesh);
}

/**
 * Función para liberar de la memoria la línea de histórico de estrellas visitadas.
 */
function destroyVisitedStar() {
	
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
  * Settter hoveredStar.
  *
  * @param newDir el nuevo valor.
  */
export function setHoveredStar(value) {
	hoveredStar = value;
}

/**
  * Settter hoveredArm.
  *
  * @param newDir el nuevo valor.
  */
export function setHoveredArm(value) {
	hoveredArm = value;
}

/**
  * Settter selectedStar.
  *
  * @param newDir el nuevo valor.
  */
export function setSelectedStar(value) {
	selectedStar = value;
}

/**
  * Settter selectedArm.
  *
  * @param newDir el nuevo valor.
  */
export function setSelectedArm(value) {
	selectedArm = value;
}

/**
  * Settter visitedStars.
  *
  * @param value el nuevo valor.
  */
export function setVisitedStars(value) {
	visitedStars = value;
}

/**
  * Settter visitedStarsPos.
  *
  * @param value el nuevo valor.
  */
export function setVisitedStarsPos(value) {
	visitedStarsPos = value;
}

/**
  * Settter visitedStarsLinesColors.
  *
  * @param value el nuevo valor.
  */
export function setVisitedStarsLinesColors(value) {
	visitedStarsLinesColors = value;
}
