/**
  * Módulo de cubo.
  * Usar este módulo para instanciar cubos en el escenario.
  */

import * as THREE from '/js/libs/three.module.js';

import * as game from '/js/game/game.js';
import * as graphics from '/js/graphics/graphics.js';

import * as collider from '/js/game/collider.js';

/** Texture del modelo del cubo. */
let texture;
/** Modelo del cubo. */
let geometry;
/** Shader del cubo. */
let material;
/** Mesh del cubo. */
let cubeMesh;

/**
  * Función de inicialización del módulo.
  * 
  * @param posX la posición X.
  * @param posY la posición Y.
  * @param posZ la posición Z.
  *
  * @param rotX la rotación X.
  * @param rotY la rotación Y.
  * @param rotZ la rotación Z.
  *
  * @param scaleX la escala X.
  * @param scaleY la escala Y.
  * @param scaleZ la escala Z.
  */
export function init(posX, posY, posZ, rotX, rotY, rotZ, scaleX, scaleY, scaleZ, color) {
	// Representación del cubo.
	texture = new THREE.TextureLoader().load('/image/water.png');
	texture.minFilter = texture.magFilter = graphics.filtering; 
	
	geometry = new THREE.BoxGeometry(1, 1, 1);
	
	//geometry.rotateX(rotX);
	//geometry.rotateY(rotY);
	//geometry.rotateZ(rotZ);
	
	geometry.scale(scaleX, scaleY, scaleZ);
	geometry.applyQuaternion(new THREE.Quaternion().setFromEuler(new THREE.Euler(rotX, rotY, rotZ)));
	
	/*let positions = geometry.getAttribute('position');
	let vertex = new THREE.Vector3();
	
	for (let i = 0; i < positions.count; ++i) {
		vertex.fromBufferAttribute(positions, i);
		
		let distanceY = Math.sqrt(vertex.x * vertex.x + vertex.y * vertex.y + vertex.z * vertex.z);
		
		let posX = vertex.x*0 + Math.cos(rotY) * distanceY;
		let posY = vertex.y;
		let posZ = vertex.z*0 + Math.cos(rotY) * distanceY;
		console.log(posX);
		
		positions.setXYZ(
			i,
			posX,
			posY,
			posZ
		);
	}*/
	
	geometry.computeVertexNormals();
	geometry.normalizeNormals();
	
	material = new /*THREE.MeshToonMaterial*/THREE.MeshBasicMaterial( { color: color, map: texture } );
	cubeMesh = new THREE.Mesh(geometry, material);
	
	cubeMesh.position.x = posX;
	cubeMesh.position.y = posY;
	cubeMesh.position.z = posZ;
	
	cubeMesh.castShadow = true;
	cubeMesh.receiveShadow = true;
	
	//cubeMesh.rotation.x = rotX;
	//cubeMesh.rotation.y = rotY;
	//cubeMesh.rotation.z = rotZ;
	
	graphics.currentScene.add(cubeMesh);
	
	// Añadir collider.
	collider.add(cubeMesh, geometry, rotX, rotY, rotZ, scaleX, scaleY, scaleZ);
}

/**
  * Función de bucle del módulo.
  */
export function update() {
	
}

/**
 * Función para liberar de la memoria los datos del jugador.
 */
export function destroy() {
	// Representación gráfica.
	texture.dispose();
	geometry.dispose();
	material.dispose();
	graphics.currentScene.remove(cubeMesh);
}
