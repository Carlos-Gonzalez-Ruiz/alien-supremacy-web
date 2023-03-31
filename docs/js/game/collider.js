/**
  * Módulo de collider.
  * Este módullo guardará la información sobre todos los collider para que el jugador pueda hacer uso de ellos.
  */
import * as THREE from '/proyecto-fin-ciclo/js/libs/three.module.js';
import * as graphics from '/proyecto-fin-ciclo/js/graphics/graphics.js';

import * as player from '/proyecto-fin-ciclo/js/game/player.js';

/** Array con los colliders. */
export let colliders = [];

/**
  * Función para añadir collider al array.
  *
  * @param geometry el geometry de colisión.
  */
export function add(mesh, geometry, rotX, rotY, rotZ, scaleX, scaleY, scaleZ) {
	let texture = new THREE.TextureLoader().load('/proyecto-fin-ciclo/image/aliensand.png');
	texture.minFilter = texture.magFilter = graphics.filtering; 
	
	let cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
	cubeGeometry.scale(
		scaleX,
		scaleY,
		scaleZ
	);
	cubeGeometry.applyQuaternion(new THREE.Quaternion().setFromEuler(new THREE.Euler(rotX, rotY, rotZ)));
	cubeGeometry.computeBoundingBox();
	
	let boundingBox = cubeGeometry.boundingBox;
	cubeGeometry.scale(
		1 + (player.playerWidth / boundingBox.max.x),
		1 + (player.playerHeight / boundingBox.max.y) / 2,
		1 + (player.playerWidth / boundingBox.max.z)
	);
	
	let material = new THREE.MeshBasicMaterial( { color: 0x676767, map: texture } );
	let cubeMesh = new THREE.Mesh(cubeGeometry, material);
	
	cubeMesh.position.x = mesh.position.x;
	cubeMesh.position.y = mesh.position.y - player.playerHeight / 2;
	cubeMesh.position.z = mesh.position.z;
	
	graphics.currentScene.add(cubeMesh);
	
	colliders.push(cubeMesh);
	
	cubeMesh.visible = false;
}

