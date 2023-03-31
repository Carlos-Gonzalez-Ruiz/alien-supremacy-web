/**
  * Módulo para el mostrado de la escena de universo.
  * El universo es el skybox de galaxia.
  */

import * as THREE from './js/libs/three.module.js';

import * as graphics from './js/graphics/graphics.js';

/** Vista de renderizado del módulo. */
export let view;

/** Textura de las galaxias. */
let galaxyTextures = [];
/** Material de las galaxias. */
let galaxyMaterial;
/** Geometry de las galaxias. */
let galaxyGeometry;
/** Mesh de las galaxias. */
let galaxyMesh;

/** Textura del polvo cósmico. */
let dustTexture;
/** Material del polvo cósmico. */
let dustMaterial;
/** Geometry del polvo cósmico. */
let dustGeometries = [];
/** Mesh del polvo cósmico. */
let dustMeshes = [];

/**
  * Función de inicialización del módulo.
  */
export function init() {
	// Inicializar representación gráfica.
	view = graphics.createView(true);
	
	initGalaxies();
	initDust();	
}

/**
  * Función de inicialización de galaxias.
  */
function initGalaxies() {
	// Texturas.
	{
		let texture = new THREE.TextureLoader().load('./image/flarehd.png');
		texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
		texture.minFilter = texture.magFilter = graphics.filtering;
		
		galaxyTextures.push(texture);
	}
	{
		let texture = new THREE.TextureLoader().load('./image/flare2hd.png');
		texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
		texture.minFilter = texture.magFilter = graphics.filtering;
		
		galaxyTextures.push(texture);
	}
	
	
	// Material.
	{
		galaxyMaterial = new THREE.ShaderMaterial({
			uniforms: {
				uTime: { value: 0 },
				uPointTexture0: { value: galaxyTextures[0] },
				uPointTexture1: { value: galaxyTextures[1] },
				uMinSize: { value: 100 },
				uMaxSize: { value: 85 },
				uFogDistance: { value: /*1500*/100 }
			},
			
			vertexShader: `
				attribute vec4 aColor;
				attribute float aSize;
				
				varying float vDepth;
				varying vec4 vColor;
				
				uniform float uMinSize;
				uniform float uMaxSize;
				
				void main() {
					vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
					
					gl_PointSize = aSize * (uMaxSize / -mvPosition.z);
					gl_PointSize = min(uMinSize, gl_PointSize);

					gl_Position = projectionMatrix * mvPosition;
					
					vDepth = -mvPosition.z;
					vColor = aColor;
				}
			`,
			fragmentShader: `
				uniform float uTime;
				uniform float uFogDistance;
				
				varying float vDepth;
				varying vec4 vColor;
				
				#define M_PI ${Math.PI}f
				
				void main() {
					float currentTime = mod(uTime + (vColor.x + vColor.y + vColor.z) * 372.0f, M_PI);
					float currentTimeHalo = mod(uTime * 2.0f + (vColor.x + vColor.y + vColor.z) * 261.0f, M_PI);
					
					float pointX = (gl_PointCoord.x - 0.5f) * 2.0f;
					float pointY = (gl_PointCoord.y - 0.5f) * 2.0f;
					float distance = min( (1.0f - sqrt(pointX * pointX + pointY * pointY)) * (1.0f - sin(currentTimeHalo)) , 0.65f ) * 0.14f;
					gl_FragColor = vec4(distance, distance, distance, 1) * vColor * vec4(1, 1, 1, uFogDistance / vDepth) * 0.5f;
				}
			`,
			blending: THREE.AdditiveBlending,
			depthTest: false,
			transparent: true
		});
	}
	
	const vertices = [];
	const colors = [];
	const sizes = [];
	
	// Generar fondo.
	{
		const N_TOTAL_GALAXIES = 1500;
		const GALAXY_MIN_SIZE = 1;
		const GALAXY_MAX_SIZE = 3;
		
		for (let i = 0; i < N_TOTAL_GALAXIES; ++i) {
			let x = -25 + Math.random() * 50;
			let y = -25 + Math.random() * 50;
			let z = -25 + Math.random() * 50;
			
			let red = 0.5 + Math.random();
			let blue = 0.5 + Math.random();
			let green = 0.5 + Math.random();
			
			let size = GALAXY_MIN_SIZE + Math.random() * GALAXY_MAX_SIZE;
			
			vertices.push(x, y, z);
			colors.push(red, green, blue, 1);
			sizes.push(size);
		}
	}
	
	// Geometría.
	galaxyGeometry = new THREE.BufferGeometry();
	galaxyGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
	galaxyGeometry.setAttribute('aColor', new THREE.Float32BufferAttribute(colors, 4));
	galaxyGeometry.setAttribute('aSize', new THREE.Float32BufferAttribute(sizes, 1));
	
	// Mesh.
	galaxyMesh = new THREE.Points(galaxyGeometry, galaxyMaterial);

	// Añadir a la escena.
	view.scene.add(galaxyMesh);
}

/**
  * Función de inicialización de polvo cósmico.
  */
function initDust() {
	// Textura.
	dustTexture = new THREE.TextureLoader().load('./image/dust1.png');
	dustTexture.wrapS = dustTexture.wrapT = THREE.ClampToEdgeWrapping;
	dustTexture.minFilter = dustTexture.magFilter = graphics.filtering;
	
	// Material.
	dustMaterial = new THREE.MeshBasicMaterial(
		{
			color: 0x070707,
			map: dustTexture,
			blending: THREE.NormalBlending,
			depthTest: false,
			transparent: true,
			dithering: true,
			side: THREE.DoubleSide
		}
	);
	
	for (let i = 0; i < 20; ++i) {
		// Geometría.
		let geometry = new THREE.PlaneGeometry(45 + Math.random() * 20, 45 + Math.random() * 20);
		dustGeometries.push(geometry);
		
		// Mesh.
		let mesh = new THREE.Mesh(geometry, dustMaterial);
		
		mesh.position.x = -80 + Math.random() * 160;
		mesh.position.y = -80 + Math.random() * 160;
		mesh.position.z = -80 + Math.random() * 160;
		
		// Rotación al origen 0, 0, 0.
		mesh.lookAt(0, 0, 0);
		mesh.rotation.x += Math.PI / 6 * Math.random();
		mesh.rotation.y += Math.PI / 6 * Math.random();
		mesh.rotation.z += Math.PI / 6 * Math.random();
		
		dustMeshes.push(mesh);
		
		// Añadir a la escena.
		view.scene.add(mesh);
	}
}

/**
  * Función de bucle del módulo.
  */
export function update() {
	// Animaciones y efectos.
	galaxyMaterial.uniforms.uTime.value += 0.001;
	if (galaxyMaterial.uniforms.uTime.value > Math.PI) {
		galaxyMaterial.uniforms.uTime.value = 0;
	}
}

/**
 * Función para liberar de la memoria del módulo.
 */
export function destroy() {
	destroyGalaxy();
	destroyDust();
}

/**
 * Función para liberar de la memoria las galaxias.
 */
function destroyGalaxy() {
	// Representación gráfica.
	galaxyTextures[0].dispose();
	galaxyTextures[1].dispose();
	galaxyMaterial.dispose();
	for (let i = 0; i < N_ARMS; ++i) {
		galaxyGeometries[i].dispose();
		scene.remove(galaxyMeshes[i]);
	}
}

/**
 * Función para liberar de la memoria el polvo cósmico.
 */
function destroyDust() {
	// Representación gráfica.
	dustTexture.dispose();
	dustMaterial.dispose();
	for (let i = 0; i < N_ARMS; ++i) {
		dustGeometries[i].dispose();
		scene.remove(dustMeshes[i]);
	}
}
