/**
  * Módulo de jugador.
  * Este módulo se encarga de mover la cámara en función de los controles.
  */

import * as THREE from '/js/libs/three.module.js';

import * as keyboardConstants from '/js/constants/keyboard-constants.js';

import * as game from '/js/game/game.js';
import * as graphics from '/js/graphics/graphics.js';
import * as keyboard from '/js/keyboard/keyboard.js';

import * as collider from '/js/game/collider.js';
import * as world from '/js/game/world.js';

/* PROPIEDADES DEL JUGADOR */
/// ....

/** Texture del modelo del jugador. */
let texture;
/** Modelo del jugador. */
let geometry;
/** Shader del jugador. */
let material;
/** Mesh del jugador. */
let playerMesh;

/** Pos X del jugador. */
export let posX = -20;
/** Pos Y del jugador. */
export let posY = 70;
/** Pos Z del jugador. */
export let posZ = 0;

/** Dirección X de vista. */
let viewDirectionX = Math.PI / 7;
/** Dirección Y de vista. */
let viewDirectionY = 0;
/** Distancia de la cámara al modelo. */
let viewDistance = 5;
/** Distancia mínima de la cámara al modelo. */
let viewDistanceMin = 1;
/** Distancia máxima de la cámara al modelo. (la distancia máxima tiene que tener en cuenta el terreno.) */
let viewDistanceMax = 15;
/** Aplica suavizado al cambio de distancia de la caḿara. */
let viewDistanceSpeed = 1;
/** Aplica suavizado al dejar de cambiar de distancia de la caḿara. */
let viewDistanceDeacc = 1.5;
/** Altura de la cámara al modelo. */
let viewHeight = 2;

/** Dirección a la que se mueve el jugador. */
let moveDir = 0;
/** Dirección a la que se mueve el jugador en Strafe. */
let moveStrafeDir = 0;
/** Dirección resultante de las direccciones moveDir y moveStrafeDir. */
let moveFinalDir = 0;

/** Velocidad X. */
let speedX = 0;
/** Velocidad Y. */
let speedY = 0;
/** Velocidad Z. */
let speedZ = 0;
/** Velocidad Strafe X. */
let speedStrafeX = 0;
/** Velocidad Strafe Z. */
let speedStrafeZ = 0;
/** Velocidad Deslizamiento X. */
let speedSlideX = 0;
/** Velocidad Deslizamiento Z. */
let speedSlideZ = 0;
/** Aceleración. */
let acc = 0.1;
/** Aceleración Stafe. */
let strafeAcc = 0.1;
/** Aceleración deslizamiento. */
let slideAcc = 0.1;
/** Factor de desaceleración. (La operación es la sigueinte: speed /= deacc) */
let deacc = 2;
/** Factor de desaceleración Strafe. (La operación es la sigueinte: speed /= deacc) */
let strafeDeacc = 2;
/** Factor de desaceleración deslizamiento. (La operación es la sigueinte: speed /= deacc) */
let slideDeacc = 1.15;
/** Velocidad máxima. */
let maxSpeed = 0.25;
/** Velocidad máxima Stfe. */
let maxStrafeSpeed = 0.20;

/** Raycaster. */
let raycaster;

/** Indicar si está siendo deslizado el jugador. */
let notSliding = true;
/** Indicar si está siendo movido el jugador. */
let notMoving = true;
/** Indicar si está siendo movido lateralmente el jugador. */
let notMovingStrafe = true;
/** Indicar si está siendo deslizado sobre el eje X. */
let slidingX = false;
/** Indicar si está siendo deslizado sobre el eje Z. */
let slidingZ = false;

/** Umbral de deslizamiento sobre cuestas. */
const slideThreshold = 0.6;

/** Anchura del jugador. */
export let playerWidth = 1;
/** Altura del jugador. */
export let playerHeight = 1;

/**
  * Función de inicialización del módulo.
  */
export function init() {
	// Misc.
	raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3());
	
	// Representación del jugador.
	texture = new THREE.TextureLoader().load('/image/water.png');
	texture.minFilter = texture.magFilter = graphics.filtering; 
	
	geometry = /*new THREE.BoxGeometry(1, 1, 1)*/ /*new THREE.IcosahedronGeometry(1, 2)*/ new THREE.CylinderGeometry(playerWidth, playerWidth, playerHeight * 2, 16);
	material = new THREE.MeshToonMaterial( { color: 0xFFFF00, map: texture } );
	playerMesh = new THREE.Mesh(geometry, material);
	
	playerMesh.position.x = posX;
	playerMesh.position.y = posY;
	playerMesh.position.z = posZ;
	
	playerMesh.castShadow = true;
	playerMesh.receiveShadow = true;
	
	graphics.currentScene.add(playerMesh);
}

/**
  * Función de bucle del módulo.
  */
export function update() {
	playerViewRotation();
	playerMovement();
	playerControls();
	playerJumping();
	playerRotation();
	playerCollision();
	playerRepresentation();
}

/**
 * Función para liberar de la memoria los datos del jugador.
 */
export function destroy() {
	// Representación gráfica.
	texture.dispose();
	geometry.dispose();
	material.dispose();
	graphics.currentScene.remove(playerMesh);
}

/**
  * Rotar vista del jugador.
  */
function playerViewRotation() {
	// Mover dirección de la cámara.
	if (keyboard.checkPressed('ArrowUp')) {
		viewDirectionX += 0.01;
	}
	if (keyboard.checkPressed('ArrowLeft')) {
		viewDirectionY += 0.01;
	}
	if (keyboard.checkPressed('ArrowDown')) {
		viewDirectionX -= 0.01;
	}
	if (keyboard.checkPressed('ArrowRight')) {
		viewDirectionY -= 0.01;
	}
	
	viewDirectionX += keyboard.cursorDeltaY / keyboardConstants.MOUSE_SENSIVITY;
	viewDirectionY -= keyboard.cursorDeltaX / keyboardConstants.MOUSE_SENSIVITY;
	
	// Limitar cámara.
	if (viewDirectionX > Math.PI / 2) {
		viewDirectionX = Math.PI / 2;
	} else if (viewDirectionX < -Math.PI / 2) {
		viewDirectionX = -Math.PI / 2;
	}
	
	// Distancia de la cámara.
	if (keyboard.wheelDeltaY != 0 && viewDistance + keyboard.wheelDeltaY * viewDistanceDeacc > viewDistanceMin &&
	viewDistance + keyboard.wheelDeltaY * viewDistanceDeacc < viewDistanceMax) {
		viewDistanceSpeed = keyboard.wheelDeltaY;
	} else {
		viewDistanceSpeed /= viewDistanceDeacc;
	}
	
	viewDistance += viewDistanceSpeed;
}

/**
  * Mover al jugador.
  */
function playerMovement() {
	// Reducir velocidad.
	notMoving = true;
	notMovingStrafe = true;
	
	if (notSliding) {
		// Aplicar aceleraciones.
		if (!keyboard.checkPressed('W') || !keyboard.checkPressed('S')) {
			if (keyboard.checkPressed('W')) {
				accelerate(viewDirectionY + 0);
				notMoving = false;
			}
			if (keyboard.checkPressed('S')) {
				accelerate(viewDirectionY + Math.PI);
				notMoving = false;
			}
		}
		
		if (!keyboard.checkPressed('A') || !keyboard.checkPressed('D')) {
			if (keyboard.checkPressed('A')) {
				accelerateStrafe(viewDirectionY + (Math.PI / 2));
				notMovingStrafe = false;
			}
			if (keyboard.checkPressed('D')) {
				accelerateStrafe(viewDirectionY + (-Math.PI / 2));
				notMovingStrafe = false;
			}
		}
	}
	
	if (notMoving) {
		speedX /= deacc;
		speedZ /= deacc;
	}
	
	if (notMovingStrafe) {
		speedStrafeX /= strafeDeacc;
		speedStrafeZ /= strafeDeacc;
	}
}

/**
  * Salto / gravedad / deslizamiento por cuesta del jugador en el terreno, así como en sólidos.
  */
function playerJumping() {
	let notOnCollider = true;
	let applyGravity = true;
	
	let intersections;
	
	/// Procesar colliders.
	if (speedY <= 0) {
		let spdXfinal = speedX + speedStrafeX + speedSlideX;
		let spdZfinal = speedZ + speedStrafeZ + speedSlideZ;
		let distSpeed = Math.sqrt(spdXfinal * spdXfinal + spdZfinal * spdZfinal);
		let dirSpeed = Math.atan2(spdXfinal, spdZfinal);
		raycaster.set(new THREE.Vector3(posX, posY, posZ), new THREE.Vector3(0, -1, 0));
		
		// Distancia del raycast.
		raycaster.far = playerHeight + Math.abs(speedY) + 1 + Math.sqrt(speedSlideX * speedSlideX + speedSlideZ * speedSlideZ);
		
		intersections = raycaster.intersectObjects(collider.colliders);
		if (intersections.length > 0) {
			notOnCollider = false;
			applyGravity = false;
			
			// Establecer velocidad y posción.
			speedY = 0;
			// Evitar subir cuestas en modelos.
			if (posY - (intersections[0].point.y) > 0.7) {
				posY = playerHeight + intersections[0].point.y;
			}
		}
	}
	
	/// Procesar techos.
	if (speedY >= 0) {
		let spdXfinal = speedX + speedStrafeX + speedSlideX;
		let spdZfinal = speedZ + speedStrafeZ + speedSlideZ;
		let distSpeed = Math.sqrt(spdXfinal * spdXfinal + spdZfinal * spdZfinal);
		let dirSpeed = Math.atan2(spdXfinal, spdZfinal);
		raycaster.set(
			new THREE.Vector3(
				posX + spdXfinal,
				posY,
				posZ + spdZfinal
			),
			new THREE.Vector3(
				0,
				1,
				0
			)
		);

		// Distancia del raycast.
		raycaster.far = Math.abs(speedY) + distSpeed;
		
		intersections = raycaster.intersectObjects(collider.colliders);
		if (intersections.length > 0) {
			// Eliminar velocidad.
			speedY = 0;
			
			//posX = intersections[0].point.x;
			//posY = intersections[0].point.y;
			//posZ = intersections[0].point.z;
			
			speedX = 0;
			speedStrafeX = 0;
			speedSlideX = 0;
			speedZ = 0;
			speedStrafeZ = 0;
			speedSlideZ = 0;
		}
	}
	
	/// Procesar cuestas.
	// Reducir velocidad de deslizamiento.
	speedSlideX /= slideDeacc;
	speedSlideZ /= slideDeacc;
	
	if (speedY <= 0) {
		// Establecer posición Y
		raycaster.set(new THREE.Vector3(posX, 100, posZ), new THREE.Vector3(0, -1, 0))
		raycaster.far = Infinity;
		
		intersections = raycaster.intersectObject(world.localWorldMesh);
		if (intersections.length > 0) {
			let heightGround = playerHeight + intersections[0].point.y;
			
			// Aplicar gravedad. (0.5 cuando puede subir le jugador en las cuestas).
			if (!(notSliding && posY > heightGround + 0.5 - (speedY < 0 ? speedY : 0))) {
				applyGravity = false;
				
				speedY = 0;
				// Establecer la posición Y en función de si no está sobre un collider o
				// (en caso de que si esté, la altura de la cuesta sea mayor)
				if (notOnCollider || posY < heightGround) {
					posY = heightGround;
				}
				
				notSliding = true;
				
				// Evitar movimiento en cuestas.
				if (notOnCollider) {
					playerSlidingX(heightGround);
					playerSlidingZ(heightGround);
				}
				
				// Permitir volver a caminar siempre y cuando la velocidad de desalizamiento
				// haya pasado por un rango anteriormente.
				if (Math.abs(speedSlideX) > 0.2 || slidingX) {
					speedX /= deacc;
					speedStrafeX /= strafeDeacc;
					
					slidingX = (Math.abs(speedSlideX) > 0.001);
				}
				if (Math.abs(speedSlideZ) > 0.2 || slidingZ) {
					speedZ /= deacc;
					speedStrafeZ /= strafeDeacc;
					
					slidingZ = (Math.abs(speedSlideZ) > 0.001);
				}
			}
		}
	}
	
	if (applyGravity) {
		speedY -= game.gravityAcc;
	} else {
		// Saltar.
		if (notSliding && keyboard.checkPressed(' ')) {
			speedY += 1;
		}
	}
}

/**
  * Deslizamiento por cuesta del jugador en el eje X.
  *
  * @param heightGround la altura del suelo en las coordenadas actuales del jugador.
  */
function playerSlidingX(heightGround) {
	let negSlide = false;
	let posSlide = false;
	
	// Velocidad X.
	let moveIntersections;
	
	// X+
	raycaster.set(
		new THREE.Vector3(
			posX + slideThreshold,
			100,
			posZ
		),
		new THREE.Vector3(0, -1, 0)
	)
	raycaster.far = Infinity;
	
	moveIntersections = raycaster.intersectObject(world.localWorldMesh);
	if (moveIntersections.length > 0) {
		let heightGroundNext = playerHeight + moveIntersections[0].point.y;
		
		let deltaHeight = heightGroundNext - heightGround;
		if (deltaHeight > slideThreshold) {
			speedSlideX -= slideAcc * (slideThreshold / deltaHeight);
			notSliding = false;
			
			posSlide = true;
		}
	}
	
	// X-
	raycaster.set(
		new THREE.Vector3(
			posX - slideThreshold,
			100,
			posZ
		),
		new THREE.Vector3(0, -1, 0)
	)
	raycaster.far = Infinity;
	
	moveIntersections = raycaster.intersectObject(world.localWorldMesh);
	if (moveIntersections.length > 0) {
		let heightGroundNext = playerHeight + moveIntersections[0].point.y;
		
		let deltaHeight = heightGroundNext - heightGround;
		if (deltaHeight > slideThreshold) {
			speedSlideX += slideAcc * (slideThreshold / deltaHeight);
			notSliding = false;
			
			negSlide = true;
		}
	}
	
	// Evitar softlocking
	if (negSlide && posSlide) {
		speedSlideX = 0;
		notSliding = true;
	}
}

/**
  * Deslizamiento por cuesta del jugador en el eje Z.
  *
  * @param heightGround la altura del suelo en las coordenadas actuales del jugador.
  */
function playerSlidingZ(heightGround) {
	let negSlide = false;
	let posSlide = false;
	
	// Velocidad Z.
	let moveIntersections;
	
	// Z+
	raycaster.set(
		new THREE.Vector3(
			posX,
			100,
			posZ + slideThreshold
		),
		new THREE.Vector3(0, -1, 0)
	)
	raycaster.far = Infinity;
	
	moveIntersections = raycaster.intersectObject(world.localWorldMesh);
	if (moveIntersections.length > 0) {
		let heightGroundNext = playerHeight + moveIntersections[0].point.y;
		
		let deltaHeight = heightGroundNext - heightGround;
		if (deltaHeight > slideThreshold) {
			speedSlideZ -= slideAcc * (slideThreshold / deltaHeight);
			notSliding = false;
			
			posSlide = true;
		}
	}
	
	// Z-
	raycaster.set(
		new THREE.Vector3(
			posX,
			100,
			posZ - slideThreshold
		),
		new THREE.Vector3(0, -1, 0)
	)
	raycaster.far = Infinity;
	
	moveIntersections = raycaster.intersectObject(world.localWorldMesh);
	if (moveIntersections.length > 0) {
		let heightGroundNext = playerHeight + moveIntersections[0].point.y;
		
		let deltaHeight = heightGroundNext - heightGround;
		if (deltaHeight > slideThreshold) {
			speedSlideZ += slideAcc * (slideThreshold / deltaHeight);
			notSliding = false;
			
			negSlide = true;
		}
	}
	
	// Evitar softlocking
	if (negSlide && posSlide) {
		speedSlideZ = 0;
		notSliding = true;
	}
}

/**
  * Rotación en la representación del jugador.
  */
function playerRotation() {
	// Rotación del modelo de jugador.
	/*if (!notMoving || !notMovingStrafe) {
		moveFinalDir = Math.atan2(speedX + speedStrafeX, speedZ + speedStrafeZ);
	}*/
	if (!notMoving && notMovingStrafe) {
		moveFinalDir = moveDir;
	} else if (notMoving && !notMovingStrafe) {
		moveFinalDir = moveStrafeDir;
	} else if (!notMoving && !notMovingStrafe) {
		moveFinalDir = (moveDir + moveStrafeDir) / 2;
	}
}

/**
  * Controles del jugador.
  */
function playerControls() {
	/*if (keyboard.checkPressed(' ')) {
		posY += 0.2;
	}*/
	/*if (keyboard.checkPressed('SHIFT')) {
		posY -= 0.2;
	}*/
	
	// Reiniciar posición del jugador.
	if (keyboard.checkReleased('R')) {
		//playerBody.position = new CANNON.Vec3(0, 50 + Math.random() * 50, 0);
		//playerBody.velocity = new CANNON.Vec3(0, 0, 0);
	}
	
	// Mostrar datos del jugador por pantalla.
	/*document.getElementById("gui-info").innerHTML = `
posX = ${posX} <br>
posY = ${posY} <br>
posZ = ${posZ} <br>
speedX = ${speedX} <br>
speedY = ${speedY} <br>
speedZ = ${speedZ} <br>
speedStrafeX = ${speedStrafeX} <br>
speedStrafeZ = ${speedStrafeZ} <br>
viewDirX = ${viewDirectionX} <br>
viewDirY = ${viewDirectionY} <br>
`;*/
}

/**
  * Realiza el cálculo de colisiones del jugador, antes de que las velocidad sean aplicadas a las posiciones.
  */
function playerCollision() {
	let intersections;
	
	///// Este algoritmo funciona mediante la obteción de la normal de la cará (face) del vértice.
	///// Esta normal contiene una serie de cordenadas cartesianas, las cuales se puede obtener un ángulo
	///// mediante la arcotangente. Este ángulo se utilizará posteriormente para el desplazamiento del
	///// jugador sobre la pared. Este desplazamiento establece la velocidad a 0, y desplaza las
	///// coordenadas del jugador al momento de ocurrir una colisión mediante un Raycast que apunta con la
	///// hipotenusa de la velocidad y su ángulo.
	///// Hay bugs al colisionar con 2 cubos al mismo tiempo. Mirar trello.

	// Colisión en los ejes X y Z.
	let spdXfinal = speedX + speedStrafeX + speedSlideX;
	let spdZfinal = speedZ + speedStrafeZ + speedSlideZ;
	let distSpeed = Math.sqrt(spdXfinal * spdXfinal + spdZfinal * spdZfinal);
	let dirSpeed = Math.atan2(spdXfinal, spdZfinal);
	raycaster.set(
		new THREE.Vector3(
			posX,
			posY,
			posZ
		),
		new THREE.Vector3(
			Math.sin(dirSpeed),
			0,
			Math.cos(dirSpeed)
		)
	);
	
	// Distancia del raycast.
	raycaster.far = distSpeed + maxSpeed + maxStrafeSpeed;
	
	// Procesar intersecciones colisión.
	intersections = raycaster.intersectObjects(collider.colliders);
	if (intersections.length > 0) {
		let normalResult = intersections[0].face.normal;
		
		// Aplicar rotación del mesh a la rotación obtenida mediante las coordenadas de la normal.
		let rotResult = Math.atan2(normalResult.x, normalResult.z);
		
		// Solo aplicar la posición si la hipotenusa de velocidad no es 0.
		if (distSpeed > 0 && intersections.length == 1) {
			let newSpeedX;
			let newSpeedZ;
			let newDistSpeed;
			let newDirSpeed;
			let _posX;
			let _posY;
			let _posZ;

			newSpeedX = Math.sin(rotResult) * distSpeed;
			newSpeedZ = Math.cos(rotResult) * distSpeed;
			
			newDistSpeed = Math.sqrt(newSpeedX * newSpeedX + newSpeedZ * newSpeedZ);
			newDirSpeed = Math.atan2(newSpeedX, newSpeedZ);
			
			_posX = intersections[0].point.x + newSpeedX;
			_posY = intersections[0].point.y;
			_posZ = intersections[0].point.z + newSpeedZ;
			
			// Colisión doble.
			raycaster.set(
				new THREE.Vector3(
					_posX,
					_posY,
					_posZ
				),
				new THREE.Vector3(
					Math.sin(rotResult),
					0,
					Math.cos(rotResult)
				)
			);
			
			// Distancia del raycast.
			raycaster.far = (newDistSpeed + maxSpeed + maxStrafeSpeed);
			
			// Aplicar posición final si no hay doble colisión
			let __intersections = raycaster.intersectObjects(collider.colliders);
			if (__intersections.length == 0) {
				posX = _posX;
				posY = _posY;
				posZ = _posZ;
			} else {
				normalResult = intersections[0].face.normal;
				
				// Aplicar rotación del mesh a la rotación obtenida mediante las coordenadas de la normal.
				rotResult = Math.atan2(normalResult.x, normalResult.z);
				rotResult += (Math.PI / 4) * Math.sign(rotResult - newDirSpeed);
				
				newSpeedX = Math.sin(rotResult) * newDistSpeed;
				newSpeedZ = Math.cos(rotResult) * newDistSpeed;
				
				posX = intersections[0].point.x + newSpeedX;
				posY = intersections[0].point.y;
				posZ = intersections[0].point.z + newSpeedZ;
			}
		}
		
		// Eliminar velocidad.
		speedX = 0;
		speedStrafeX = 0;
		speedSlideX = 0;
		speedZ = 0;
		speedStrafeZ = 0;
		speedSlideZ = 0;
	}
}

/**
  * Representación del jugador.
  */
function playerRepresentation() {
	// Aplicar velocidades.
	posX += speedX + speedStrafeX + speedSlideX;
	posY += speedY;
	posZ += speedZ + speedStrafeZ + speedSlideZ;
	
	playerMesh.position.x = posX;
	playerMesh.position.y = posY;
	playerMesh.position.z = posZ;
	
	// Rotación jugador.
	playerMesh.rotation.y = moveFinalDir;
	
	// Posicionamiento de la cámara.
	graphics.camera.position.x = playerMesh.position.x - Math.sin(viewDirectionY) * viewDistance * Math.cos(viewDirectionX);
	graphics.camera.position.y = playerMesh.position.y + Math.sin(viewDirectionX) * viewDistance + viewHeight;
	graphics.camera.position.z = playerMesh.position.z - Math.cos(viewDirectionY) * viewDistance * Math.cos(viewDirectionX);
	
	// Hacer que la cámara no atraviese parades.
	{
		const threshold = 1;
		
		raycaster.set(
			new THREE.Vector3(
				playerMesh.position.x,
				playerMesh.position.y + viewHeight,
				playerMesh.position.z
			),
			new THREE.Vector3(
				-Math.sin(viewDirectionY) * Math.cos(viewDirectionX),
				Math.sin(viewDirectionX),
				-Math.cos(viewDirectionY) * Math.cos(viewDirectionX))
		);
		raycaster.far = viewDistance + threshold;
		
		let worldCollider = collider.colliders.concat(world.localWorldMesh);
		let intersections = raycaster.intersectObjects(worldCollider);
		if (intersections.length > 0) {
			graphics.camera.position.x = intersections[0].point.x + Math.sin(viewDirectionY) * Math.cos(viewDirectionX) * threshold;
			graphics.camera.position.y = intersections[0].point.y - Math.sin(viewDirectionX);
			graphics.camera.position.z = intersections[0].point.z + Math.cos(viewDirectionY) * Math.cos(viewDirectionX) * threshold;
		}
	}
	
	// Aplicar rotacion XYZ
	graphics.camera.setRotationFromEuler(new THREE.Euler(-viewDirectionX, viewDirectionY - Math.PI, 0, 'YXZ'));
}

/**
 * Función para aplicar aceleración a la vecidad del jugador.
 * 
 * @param newDirection la dirección
 */
function accelerate(newDirection) {
	let cos = Math.cos(newDirection);
	let sin = Math.sin(newDirection);
	
	// Limitar la velocidad X.
	if (sin > 0) {
		if (speedX < maxSpeed * sin) {
			speedX += acc * sin;
		} else {
			speedX = maxSpeed * sin;
		}
	} else if (sin < 0) {
		if (speedX > maxSpeed * sin) {
			speedX += acc * sin;
		} else {
			speedX = maxSpeed * sin;
		}
	}
	
	// Limitar la velocidad Y.
	if (cos > 0) {
		if (speedZ < maxSpeed * cos) {
			speedZ += acc * cos;
		} else {
			speedZ = maxSpeed * cos;
		}
	} else if (cos < 0) {
		if (speedZ > maxSpeed * cos) {
			speedZ += acc * cos;
		} else {
			speedZ = maxSpeed * cos;
		}
	}
	
	moveDir = newDirection;
}

/**
 * Función para aplicar aceleración a la vecidad del jugador, cuando este haga strafe.
 * 
 * @param newDirection la dirección
 */
function accelerateStrafe(newDirection) {
	let cos = Math.cos(newDirection);
	let sin = Math.sin(newDirection);
	
	// Limitar la velocidad X.
	if (sin > 0) {
		if (speedStrafeX < maxStrafeSpeed * sin) {
			speedStrafeX += acc * sin;
		} else {
			speedStrafeX = maxStrafeSpeed * sin;
		}
	} else if (sin < 0) {
		if (speedStrafeX > maxStrafeSpeed * sin) {
			speedStrafeX += acc * sin;
		} else {
			speedStrafeX = maxStrafeSpeed * sin;
		}
	}
	
	// Limitar la velocidad Y.
	if (cos > 0) {
		if (speedStrafeZ < maxStrafeSpeed * cos) {
			speedStrafeZ += acc * cos;
		} else {
			speedStrafeZ = maxStrafeSpeed * cos;
		}
	} else if (cos < 0) {
		if (speedStrafeZ > maxStrafeSpeed * cos) {
			speedStrafeZ += acc * cos;
		} else {
			speedStrafeZ = maxStrafeSpeed * cos;
		}
	}
	
	moveStrafeDir = newDirection;
}
