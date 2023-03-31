/**
  * Punto de entrada.
  */

import * as main from '/js/main.js';

// Inicar main.
main.init();
// Inicar bucle.
main.updateLoop();

/*import * as THREE from 'https://unpkg.com/three/build/three.module.js';

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);



function create() {
	let texture = new THREE.TextureLoader().load('/image/water.png');
	texture.minFilter = texture.magFilter = THREE.NearestFilter; // THREE.LinearFilter
	
	// Sin instancing
	for (let i = 0; i < 5; ++i) {
		let geometry = new THREE.BoxGeometry(1, 1, 1);
		let material = new THREE.MeshBasicMaterial( { color: 0xFF00FF, map: texture } );
		let cube = new THREE.Mesh(geometry, material);
		
		cube.position.x = Math.random() * 20 - 10;
		cube.position.y = Math.random() * 20 - 10;
		cube.position.z = -0;
		
		scene.add(cube);
	}
	
	// Con instancing.
	let count = 100000;
	let geometry = new THREE.BoxGeometry(1, 1, 1);
	let material = new THREE.MeshBasicMaterial( { color: 0xFFFFFF, map: texture } );
	let mesh = new THREE.InstancedMesh(geometry, material, count);
	for (let i = 0; i < count; ++i) {
		let matrix = new THREE.Matrix4();
		
		matrix.setPosition(Math.random() * 20 - 10, Math.random() * 20 - 10, -10);
		
		mesh.setMatrixAt(i, matrix);
	}
	
	scene.add(mesh);
	
	camera.position.z = 5;
}

let time = Math.floor(Date.now() / 1000);
let frames = 0;
function update() {
	requestAnimationFrame(update);
	
	//cube.rotation.x += 0.01;
	//cube.rotation.y += 0.01;
	
	renderer.render(scene, camera);
	
	++frames;
	if (time != Math.floor(Date.now() / 1000)) {
		console.log("FPS: " + frames);
		frames = 0;
		time = Math.floor(Date.now() / 1000);
	}
}

create();
update();*/