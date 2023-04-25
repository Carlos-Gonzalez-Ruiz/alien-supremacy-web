/**
  * Módulo de control de sistema estelar.
  */

import * as THREE from '/js/libs/three.module.js';

import * as gameConstants from '/js/constants/game-constants.js';
import * as keyboardConstants from '/js/constants/keyboard-constants.js';

import * as graphics from '/js/graphics/graphics.js';
import * as keyboard from '/js/keyboard/keyboard.js';

import * as game from '/js/game/game.js';
import * as gameControl from '/js/game/game-control.js';

import * as galaxyControl from '/js/game/scene/galaxy-control.js'
import * as galaxyControlUi from '/js/game/scene/galaxy-control-ui.js';

import * as starSystem from '/js/game/scene/starsystem.js';
import * as starSystemControlUi from '/js/game/scene/starsystem-control-ui.js';

/** Raycaster. */
let raycaster;
/** Pointer del raycaster. */
let raycasterPointer = new THREE.Vector2(0, 0);

/** Planeta dónde se ha posado el ratón. */
export let hoveredPlanet = -1;
/** Nombre del planeta en dónde se ha posado el ratón. */
export let hoveredPlanetName = '';
/** Planeta seleccionada. */
export let selectedPlanet = -1;
/** Nombre del planeta seleccionado. */
export let selectedPlanetName = '';
/** Posición del planeta seleccionada anteriormente. (para actualizado de la UI) */
let selectedPlanetPrevPos = new THREE.Vector3();

/** Textura de apuntado. */
let hoverPlanetTexture;
/** Material de apuntado. */
let hoverPlanetMaterial;
/** Geometry de apuntado. */
let hoverPlanetGeometry;
/** Mesh de apuntado. */
export let hoverPlanetMesh;

/** Textura de selección. */
let selectedPlanetTexture;
/** Material de selección. */
let selectedPlanetMaterial;
/** Geometry de selección. */
let selectedPlanetGeometry;
/** Mesh de selección. */
export let selectedPlanetMesh;

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
let distanceMax = 250;
/** Aplica suavizado al cambio de distancia de la caḿara. */
let distanceSpeed = 0;
/** Sensibilidad a la rueda del ratón. */
let distanceSpeedFactor = 4;
/** Aplica suavizado al dejar de cambiar de distancia de la caḿara. */
let distanceDeacc = 1.5;

/** Indica si está cargando o no. */
let loading = false;

/**
  * Función de inicialización del módulo.
  */
export function init() {
	// Raycaster.
	raycaster = new THREE.Raycaster();
	raycaster.params.Points.threshold = 0.5;
	
	initHoverPlanet();
	initSelectedPlanet();
	
	starSystemControlUi.init();
}

/**
  * Función de inicialización de apuntado.
  */
function initHoverPlanet() {
	// Textura.
	hoverPlanetTexture = new THREE.TextureLoader().load('/image/round-select.png');
	hoverPlanetTexture.wrapS = hoverPlanetTexture.wrapT = THREE.ClampToEdgeWrapping;
	hoverPlanetTexture.minFilter = hoverPlanetTexture.magFilter = THREE.LinearFilter;
	
	// Material.
	hoverPlanetMaterial = new THREE.PointsMaterial(
		{
			color: 0xCCCCCC,
			map: hoverPlanetTexture,
			blending: THREE.AdditiveBlending,
			depthTest: false,
			transparent: true
		}
	);
	// Geometría.
	hoverPlanetGeometry = new THREE.BufferGeometry();
	hoverPlanetGeometry.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0], 3));
	// Mesh.
	hoverPlanetMesh = new THREE.Points(hoverPlanetGeometry, hoverPlanetMaterial);
	
	// Añadir a la escena.
	starSystem.view.scene.add(hoverPlanetMesh);
}

/**
  * Función de inicialización de selección.
  */
function initSelectedPlanet() {
	// Textura.
	selectedPlanetTexture = new THREE.TextureLoader().load('/image/round-select.png');
	selectedPlanetTexture.wrapS = selectedPlanetTexture.wrapT = THREE.ClampToEdgeWrapping;
	selectedPlanetTexture.minFilter = selectedPlanetTexture.magFilter = THREE.LinearFilter;
	
	// Material.
	selectedPlanetMaterial = new THREE.PointsMaterial(
		{
			color: 0xFFFFFF,
			map: selectedPlanetTexture,
			blending: THREE.AdditiveBlending,
			depthTest: false,
			transparent: true
		}
	);
	// Geometría.
	selectedPlanetGeometry = new THREE.BufferGeometry();
	selectedPlanetGeometry.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0], 3));
	// Mesh.
	selectedPlanetMesh = new THREE.Points(selectedPlanetGeometry, selectedPlanetMaterial);
	
	// Añadir a la escena.
	starSystem.view.scene.add(selectedPlanetMesh);
}

/**
  * Función de bucle del módulo.
  */
export function update() {
	starSystemControlUi.update();
	
	// Solo permitir control en caso de que el nivel sea el adecuado.
	if (game.viewLevel == gameConstants.VIEW_LEVEL_STARSYSTEM) {
		if (loading && starSystem.group.visible) {
			let dst = Math.sqrt(posX * posX + posY * posY + posZ * posZ);
			if (dst > 0.025) { // Para cuando se llegue a cierto punto.
				let dstXZ = Math.sqrt(posX * posX + posZ * posZ);
				
				let dirX = Math.atan2(dstXZ, posY);
				let dirY = Math.atan2(posX, posZ);
				
				posX -= Math.sin(dirY) * dst / 5 * Math.sin(dirX);
				posY -= Math.cos(dirX) * dst / 5;
				posZ -= Math.cos(dirY) * dst / 5 * Math.sin(dirX);
			} else {
				posX = 0;
				posY = 0;
				posZ = 0;
				
				loading = false;
			}
		}
		
		movement();
		camera();
		userInterface();
	}
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
		starSystem.objectGroup.position.x += 1;
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
	starSystem.view.camera.position.x = posX - Math.sin(dirY) * Math.cos(dirX) * distance;
	starSystem.view.camera.position.y = posY + Math.sin(dirX) * distance;
	starSystem.view.camera.position.z = posZ - Math.cos(dirY) * Math.cos(dirX) * distance;
	
	// Aplicar rotacion XYZ
	graphics.setDirX(-dirX);
	graphics.setDirY(dirY - Math.PI);
}

/**
  * Función para todo lo relativo a temas de interfaz de usuario de manera general.
  */
function userInterface() {
	// Función para cuando ocurra una intersección-
	function intersectionOccurs(index) {
		// Establecer tamaño de selección.
		hoverPlanetMaterial.size = starSystem.collisionMeshes[index].scale.x * 2.3;
		
		hoverPlanetMesh.visible = true;
		hoverPlanetMesh.position.x = starSystem.collisionMeshes[index].position.x;
		hoverPlanetMesh.position.y = starSystem.collisionMeshes[index].position.y;
		hoverPlanetMesh.position.z = starSystem.collisionMeshes[index].position.z;
		
		// Mostrar datos de estrella.
		if (selectedPlanet != index) {
			hoverPlanet(index);
		}
		
		// Seleccionar estrella.
		if (!keyboard.onDomUI && galaxyControl.hoveredStar == -1 && galaxyControl.selectedStar == -1 && keyboard.checkMouseButtonPressedOnce(keyboardConstants.MB_LEFT)) {
			if (selectedPlanet != index) {
				// Establecer tamaño de selección.
				selectedPlanetMaterial.size = starSystem.collisionMeshes[index].scale.x * 2.3;
				
				selectedPlanetMesh.visible = true;
				selectedPlanetMesh.position.x = starSystem.collisionMeshes[index].position.x;
				selectedPlanetMesh.position.y = starSystem.collisionMeshes[index].position.y;
				selectedPlanetMesh.position.z = starSystem.collisionMeshes[index].position.z;
				
				// Dejar de mostrar caja de posar sobre estrella.
				unhoverPlanet();
				
				// Mostrar caja de selección.
				selectPlanet(index);
			} else {
				// Deseleccionar al hacer click otra vez.
				unselectPlanet();
			}
		}
	}
	
	// Función para cuando no ocurra una intersección-
	function noIntersectionOccurs() {
		// Dejar de mostrar datos de estrella.
		if (hoveredPlanet != -1 || hoverPlanetMesh.visible) {
			unhoverPlanet();
		}
		
		// Deseleccionar estrella.
		if (keyboard.checkMouseButtonPressedOnce(keyboardConstants.MB_LEFT) && selectedPlanet != -1) {
			unselectPlanet();
		}
	}
	
	// Comprobar intersecciones.
	let maxDistance = 5000;
	let timeRate = 200;
	
	if (Math.floor(Date.now() / timeRate) % 1 == 0) {
		raycasterPointer.x = (keyboard.cursorPosX / graphics.canvas.width) * 2 - 1;
		raycasterPointer.y = - (keyboard.cursorPosY / graphics.canvas.height) * 2 + 1;
		raycaster.setFromCamera(raycasterPointer, starSystem.view.camera);
		raycaster.far = maxDistance;
		
		let intersections = raycaster.intersectObjects(starSystem.groupCollision.children, true);
		if (!keyboard.onDomUI && !gameControl.selecting && galaxyControl.hoveredStar == -1 && galaxyControl.selectedStar == -1 && intersections.length > 0) {
			let index = intersections[0].object.name;
			
			if (index != null) {
				intersectionOccurs(index);
			} else {
				noIntersectionOccurs();
			}
		} else {
			noIntersectionOccurs();
		}
	}
	
	// Actalizar posción de la estrella de selección.
	if (selectedPlanet != -1 && selectedPlanetMesh.visible) {
		let vertex = starSystem.collisionMeshes[selectedPlanet].position;
		
		// Actualizar UI en caso de movimiento.
		let accuracy = 100; // Hacer que sea más insensible al movimiento.
		
		let positionX = Math.floor(vertex.x * accuracy);
		let positionY = Math.floor(vertex.y * accuracy);
		let positionZ = Math.floor(vertex.z * accuracy);
		
		if (selectedPlanetPrevPos.x != positionX || selectedPlanetPrevPos.y != positionY || selectedPlanetPrevPos.z != positionZ) {
			// Actualizar cámara.
			cameraOnUpdate();
		}
		
		selectedPlanetMesh.position.x = vertex.x;
		selectedPlanetMesh.position.y = vertex.y;
		selectedPlanetMesh.position.z = vertex.z;
		
		selectedPlanetPrevPos.x = positionX;
		selectedPlanetPrevPos.y = positionY;
		selectedPlanetPrevPos.z = positionZ;
	} else if (selectedPlanet == -1 && selectedPlanetMesh.visible) { // Dejar de mostrar selección.
		selectedPlanetMesh.visible = false;
	}
}


/**
  * Callback de actualización cuando la cámara sea actualizada.
  */
export function cameraOnUpdate() {
	// Actualizar interfaz de usuario DOM.
	starSystemControlUi.cameraOnUpdate();
	// Adicionalmente, actualizar el de galaxia.
	galaxyControlUi.cameraOnUpdate();
}

/**
 * Función para liberar de la memoria del módulo.
 */
export function destroy() {
	destroyHoverPlanet();
	destroySelectPlanet();
}

/**
 * Función para liberar de la memoria la selección.
 */
function destroyHoverPlanet() {
	hoverPlanetTexture.dispose();
	hoverPlanetMaterial.dispose();
	hoverPlanetGeometry.dipose();
	starSystem.view.scene.remove(hoverStarMesh);
}

/**
 * Función para liberar de la memoria el apuntado.
 */
function destroySelectedPlanet() {
	selectedPlanetTexture.dispose();
	selectedPlanetMaterial.dispose();
	selectedPlanetGeometry.dipose();
	starSystem.view.scene.remove(selectedPlanetMesh);
}


/**
  * Función para resetear todos las variables de control.
  */
export function resetAll() {
	// Resetear posición y distancia.
	posX = 0;
	posY = 0;
	posZ = 0;
	distance = 200;
	
	// Indicar inicio de carga.
	loading = true;
}

/**
  * Función para abstraer el posar sobre una estrella,
  *
  * @param index índice de la estrella en el brazo.
  */
export function hoverPlanet(index) {
	starSystemControlUi.displayPlanetHoveredBox();
	
	hoveredPlanet = index;
	setHoveredPlanetName(index);
}

/**
  * Función para abstraer el seleccionar un planeta,
  *
  * @param index índice del planeta.
  */
export function selectPlanet(index) {
	starSystemControlUi.displayPlanetSelectedBox();
	
	selectedPlanet = index;
	setSelectedPlanetName(index);
}

/**
  * Función para abstraer el dejar de posar sobre un planeta.
  */
export function unhoverPlanet() {
	hoverPlanetMesh.visible = false;
	
	hoveredPlanet = -1;
	starSystemControlUi.hidePlanetHoveredBox();
}

/**
  * Función para abstraer el dejar de seleccionar un planeta.
  */
export function unselectPlanet() {
	selectedPlanetMesh.visible = false;
		
	selectedPlanet = -1;
	starSystemControlUi.hidePlanetSelectedBox();
}

/**
  * Función para ir a la estrella siguiente del histórico de estrellas visitadas.
  */
export function goPrevStar() {
	let newVisitedStarsPos = galaxyControl.visitedStarsPos - 1;
	
	if (newVisitedStarsPos > 0) {
		galaxyControl.setVisitedStarsPos(newVisitedStarsPos);
		
		game.gotoStarSystem(galaxyControl.visitedStars[newVisitedStarsPos]);
	}
}

/**
  * Función para ir a la estrella siguiente del histórico de estrellas visitadas.
  */
export function goNextStar() {
	let newVisitedStarsPos = galaxyControl.visitedStarsPos + 1;
	
	if (newVisitedStarsPos < galaxyControl.visitedStars.length) {
		galaxyControl.setVisitedStarsPos(newVisitedStarsPos);
		
		game.gotoStarSystem(galaxyControl.visitedStars[newVisitedStarsPos]);
	}
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
  * Settter posX.
  *
  * @param value el nuevo valor.
  */
export function setPosX(value) {
	posX = value;
}

/**
  * Settter posY.
  *
  * @param value el nuevo valor.
  */
export function setPosY(value) {
	posY = value;
}

/**
  * Settter posZ.
  *
  * @param value el nuevo valor.
  */
export function setPosZ(value) {
	posZ = value;
}

/**
  * Settter selectedPlanet.
  *
  * @param value el nuevo valor.
  */
export function setSelectedPlanet(value) {
	selectedPlanet = value;
}

/**
  * Settter hoveredPlanetName.
  *
  * @param value el nuevo valor.
  */
export function setHoveredPlanetName(value) {
	hoveredPlanetName = value;
	
	// Actualizar estado de la UI.
	starSystemControlUi.planetHoveredBox.querySelector('span.planet-name').textContent = hoveredPlanetName;
}

/**
  * Settter selectedPlanetName.
  *
  * @param value el nuevo valor.
  */
export function setSelectedPlanetName(value) {
	selectedPlanetName = value;
	
	// Actualizar estado de la UI.
	starSystemControlUi.planetSelectedBox.querySelector('span.planet-name').textContent = selectedPlanetName;
}
