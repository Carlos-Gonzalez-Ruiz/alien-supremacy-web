/**
  * Módulo para el mostrado de la escena de galaxia.
  */

import * as THREE from './js/libs/three.module.js';

import * as graphics from './js/graphics/graphics.js';
import * as keyboard from './js/keyboard/keyboard.js';

import * as galaxyControl from './js/game/scene/galaxy-control.js'
import * as galaxyEffectTravel from './js/game/scene/galaxy-effect-travel.js'

/** Vista de renderizado del módulo. */
export let view;

/** Textura de las estrellas. */
let starTextures = [];
/** Material de las estrellas. */
let starMaterial;
/** Geometry de las estrellas. */
export let starGeometries = [];
/** Mesh de las estrellas. */
export let starMeshes = [];

/** Datos de las estrellas por índice del vértice. */
export let starData = [ [], [] ];

/** Textura del polvo cósmico. */
let dustTextures = [];
/** Material del polvo cósmico. */
let dustMaterial;
/** Geometry del polvo cósmico. */
let dustGeometries = [];
/** Mesh del polvo cósmico. */
let dustMeshes = [];

/** Velocidad de los brazos. */
let armSpeeds = [];

/** TODO: Borrar al trabajar en backend. */
const N_ARMS = 4 + Math.floor(Math.random() * 8);

/**
  * Función de inicialización del módulo.
  */
export function init() {
	// Crear escena.
	view = graphics.createView(true, galaxyControl.cameraOnUpdate);
	
	// Inicializar controles.
	galaxyControl.init();
	
	// Inicializar efectos.
	galaxyEffectTravel.init();
	
	// Inicializar representación gráfica.
	initStars();
	initDust();
	
	// Velocidad de los brazos.
	for (let i = 0; i < N_ARMS; ++i) {
		armSpeeds.push(Math.random() * 0.0001);
	}
}

/**
  * Función de inicialización de estrellas.
  */
function initStars() {
	// Texturas.
	{
		let texture = new THREE.TextureLoader().load('./image/flarehd.png');
		texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
		texture.minFilter = texture.magFilter = graphics.filtering;
		
		starTextures.push(texture);
	}
	{
		let texture = new THREE.TextureLoader().load('./image/flare2hd.png');
		texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
		texture.minFilter = texture.magFilter = graphics.filtering;
		
		starTextures.push(texture);
	}
	
	
	// Material.
	{
		starMaterial = new THREE.ShaderMaterial({
			uniforms: {
				uTime: { value: 0 },
				uPointTexture0: { value: starTextures[0] },
				uPointTexture1: { value: starTextures[1] },
				uMinSize: { value: /*30*/100 },
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
				uniform sampler2D uPointTexture0;
				uniform sampler2D uPointTexture1;
				uniform float uTime;
				uniform float uFogDistance;
				
				varying float vDepth;
				varying vec4 vColor;
				
				#define M_PI ${Math.PI}f
				
				void main() {
					if (vDepth > 0.5f) {
						//float timeSpeed = mod(vColor.x * 10.0f + vColor.y * 20.0f + vColor.z, 2.0f);
						//float timeSpeedHalo = mod(vColor.x * 10.0f + vColor.y + vColor.z * 10.0f, 2.0f);
						
						float currentTime = mod(uTime + (vColor.x + vColor.y + vColor.z) * 372.0f, M_PI);
						float currentTimeHalo = mod(uTime * 2.0f + (vColor.x + vColor.y + vColor.z) * 261.0f, M_PI);
						
						float pointX = (gl_PointCoord.x - 0.5f) * 2.0f;
						float pointY = (gl_PointCoord.y - 0.5f) * 2.0f;
						float distance = (1.0f - sqrt(pointX * pointX + pointY * pointY)) * (1.0f - sin(currentTimeHalo)) * (vDepth / 100.0f);
						gl_FragColor = (
							vec4(distance, distance, distance, 0.2) + 
							(texture2D(uPointTexture0, vec2(gl_PointCoord.x * 2.0f, gl_PointCoord.y * 2.0f) - 0.5f ) * vec4(sin(currentTime)) ) +
							(texture2D(uPointTexture1, vec2(gl_PointCoord.x * 2.0f, gl_PointCoord.y * 2.0f) - 0.5f ) * vec4(1.0f - sin(currentTime)) ) +
							vec4(distance, distance, distance, 0)
						) * vColor * vec4(1, 1, 1, uFogDistance / vDepth);
					} else {
						discard;
					}
				}
			`,
			blending: THREE.AdditiveBlending,
			depthTest: false,
			transparent: true
		});
	}
	
	starData = [ [], [] ];
	
	// Vaciar datos.
	for (let i = 0; i < N_ARMS; ++i) {
		const vertices = [];
		const colors = [];
		const sizes = [];
		
		starData[i] = [];
		
		// Espirales.
		{
			const N_TOTAL_STARS = 1800;
			const N_STARS_PER_ARM = N_TOTAL_STARS / N_ARMS;
			const GALAXY_SIZE = 400;
			const GALAXY_HEIGHT = 20;
			const GALAXY_HEIGHT_PROPORTION = 600;
			const GALAXY_SPIRAL_RADIUS_FACTOR = 1.1;
			const GALAXY_SPIRAL_RANDOM_FACTOR = 0.1;
			const STAR_MIN_SIZE = 1;
			const STAR_MAX_SIZE = 10;
			
			let dirBase = Math.PI / N_ARMS * i;
			// Por cada espiral.
			for (let u = 0; u < N_STARS_PER_ARM; ++u) {
				let radius = Math.random() * GALAXY_SIZE;
				let dir = dirBase + radius / GALAXY_SIZE * GALAXY_SPIRAL_RADIUS_FACTOR + Math.random() * GALAXY_SPIRAL_RANDOM_FACTOR / (radius / (GALAXY_SIZE / 2));
				
				let x = Math.sin(dir * Math.PI * 2) * radius;
				let y = (Math.random() * GALAXY_HEIGHT - GALAXY_HEIGHT / 2);
				let z = Math.cos(dir * Math.PI * 2) * radius;
				
				let red = Math.random();
				let blue = 1 - red;
				let green = (red + blue) / 2 * Math.random();
				
				let size = STAR_MIN_SIZE + Math.random() * STAR_MAX_SIZE;
				
				starData[i][u] = {
					x: x,
					y: y,
					z: z,
					r: red,
					g: green,
					b: blue,
					size: size,
					armIndex: i,
					index: u
				};
				
				vertices.push(x, y, z);
				colors.push(red, green, blue, 1);
				sizes.push(size*0 + STAR_MAX_SIZE);
			}
		}
		
		// Geometría.
		let geometry = new THREE.BufferGeometry();
		geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
		geometry.setAttribute('aColor', new THREE.Float32BufferAttribute(colors, 4));
		geometry.setAttribute('aSize', new THREE.Float32BufferAttribute(sizes, 1));
		
		// Mesh.
		let mesh = new THREE.Points(geometry, starMaterial);
		mesh.name = i;
		
		starGeometries.push(geometry);
		starMeshes.push(mesh);

		// Añadir a la escena.
		view.scene.add(mesh);
	}
}

/**
  * Función de inicialización de polvo cósmico.
  */
function initDust() {
	// Texturas.
	{
		let texture = new THREE.TextureLoader().load('./image/dust0.png');
		texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
		texture.minFilter = texture.magFilter = graphics.filtering;
		
		dustTextures.push(texture);
	}
	{
		let texture = new THREE.TextureLoader().load('./image/dust1.png');
		texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
		texture.minFilter = texture.magFilter = graphics.filtering;
		
		dustTextures.push(texture);
	}
	{
		let texture = new THREE.TextureLoader().load('./image/dust2.png');
		texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
		texture.minFilter = texture.magFilter = THREE.NearestFilter;
		
		dustTextures.push(texture);
	}
	
	// Material
	dustMaterial = new THREE.ShaderMaterial({
		uniforms: {
			uTime: { value: 0 },
			uPointTexture0: { value: dustTextures[0] },
			uPointTexture1: { value: dustTextures[1] },
			uPointTexture2: { value: dustTextures[2] },
			uMinSize: { value: 200 },
			uMaxSize: { value: 185 },
			uFogDistance: { value: /*200*/300 * graphics.aspectRatio },
			uAlphaFactor: { value: 1 }
		},
		
		vertexShader: `
			attribute vec4 aColor;
			attribute float aSize;
			attribute float aTextureId;
			
			varying float vDepth;
			varying vec4 vColor;
			varying float vTextureId;
			
			uniform float uMinSize;
			uniform float uMaxSize;
			
			uniform float uTime;
			
			#define M_PI ${Math.PI}f
			
			void main() {
				vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
				
				float currentTime = mod(uTime + (position.x + position.y + position.z) * 123.0f, M_PI);
				gl_PointSize = aSize * (uMaxSize / -mvPosition.z);
				gl_PointSize = min(uMinSize, gl_PointSize) * (0.25 + sin(currentTime));

				gl_Position = projectionMatrix * mvPosition;
				
				vDepth = -mvPosition.z;
				vColor = aColor;
				vTextureId = aTextureId;
			}
		`,
		fragmentShader: `
			uniform sampler2D uPointTexture0;
			uniform sampler2D uPointTexture1;
			uniform sampler2D uPointTexture2;
			uniform float uFogDistance;
			uniform float uAlphaFactor;
			
			varying float vDepth;
			varying vec4 vColor;
			varying float vTextureId;
			
			void main() {
				switch(int(vTextureId)) {
					case 0:
						gl_FragColor = texture2D(uPointTexture0, vec2(gl_PointCoord.x, gl_PointCoord.y));
					break;
					case 1:
						gl_FragColor = texture2D(uPointTexture1, vec2(gl_PointCoord.x, gl_PointCoord.y));
					break;
					case 2: default:
						gl_FragColor = texture2D(uPointTexture2, vec2(gl_PointCoord.x, gl_PointCoord.y));
					break;
				}
				
				gl_FragColor = gl_FragColor * vColor * vec4(1, 1, 1, vDepth / uFogDistance) * uAlphaFactor;
			}
		`,
		blending: THREE.AdditiveBlending,
		dithering: true,
		depthTest: false,
		transparent: true
	});
	
	// Datos
	for (let i = 0; i < N_ARMS; ++i) {
		const vertices = [];
		const colors = [];
		const sizes = [];
		const textureIds = [];
		
		{
			const N_TOTAL_STARS = 1500;
			const N_STARS_PER_ARM = N_TOTAL_STARS / N_ARMS;
			const GALAXY_SIZE = 400;
			const GALAXY_HEIGHT = 20;
			const GALAXY_HEIGHT_PROPORTION = 600;
			const GALAXY_SPIRAL_RADIUS_FACTOR = 1.1;
			const GALAXY_SPIRAL_RANDOM_FACTOR = 0.1;
			const STAR_MIN_SIZE = 50;
			const STAR_MAX_SIZE = 100;
			
			let dirBase = Math.PI / N_ARMS * i;
			
			let colorR = Math.random();
			let colorG = Math.random();
			let colorB = Math.random();
			
			// Por cada espiral.
			for ( let u = 0; u < N_STARS_PER_ARM; ++u) {
				let radius = Math.random() * GALAXY_SIZE;
				let dir = dirBase + radius / GALAXY_SIZE * GALAXY_SPIRAL_RADIUS_FACTOR + Math.random() * GALAXY_SPIRAL_RANDOM_FACTOR / (radius / (GALAXY_SIZE / 2));
				
				let x = Math.sin(dir * Math.PI * 2) * radius;
				let y = (Math.random() * GALAXY_HEIGHT - GALAXY_HEIGHT / 2);
				let z = Math.cos(dir * Math.PI * 2) * radius;
				
				vertices.push(x, y, z);
				colors.push(colorR + Math.random() / 3, colorG + Math.random() / 3, colorB + Math.random() / 3, 0.04);
				sizes.push(STAR_MIN_SIZE + Math.random() * STAR_MAX_SIZE);
				textureIds.push(Math.floor(Math.random() * 3));
			}
		}
		
		// Geometría.
		let geometry = new THREE.BufferGeometry();
		geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
		geometry.setAttribute('aColor', new THREE.Float32BufferAttribute(colors, 4));
		geometry.setAttribute('aSize', new THREE.Float32BufferAttribute(sizes, 1));
		geometry.setAttribute('aTextureId', new THREE.Float32BufferAttribute(textureIds, 1));
		
		// Mesh.
		let mesh = new THREE.Points(geometry, dustMaterial);
		
		dustGeometries.push(geometry);
		dustMeshes.push(mesh);
		
		// Añadir a la escena.
		view.scene.add(mesh);
	}
}


/**
  * Función de bucle del módulo.
  */
export function update() {
	// Procesamiento de los controles.
	galaxyControl.update();
	
	// Procesamiento de efectos.
	galaxyEffectTravel.update();
	
	// Animaciones y efectos.
	starMaterial.uniforms.uTime.value += 0.01;
	if (starMaterial.uniforms.uTime.value > Math.PI) {
		starMaterial.uniforms.uTime.value = 0;
	}
	
	dustMaterial.uniforms.uTime.value += 0.003;
	if (dustMaterial.uniforms.uTime.value > Math.PI) {
		dustMaterial.uniforms.uTime.value = 0;
	}
	
	for (let i = 0; i < N_ARMS; ++i) {
		starMeshes[i].rotation.y += armSpeeds[i];
		dustMeshes[i].rotation.y += armSpeeds[i];
	}
	
	{ // Efecto para evitar execeso de adición de color.
		dustMaterial.uniforms.uFogDistance.value = 175 * graphics.aspectRatio;
		
		let offset = 0.40;
		let maxDst = 50;
		let dstToCore = Math.sqrt(
			view.camera.position.x * view.camera.position.x +
			view.camera.position.y * view.camera.position.y +
			view.camera.position.z * view.camera.position.z
		);
		dustMaterial.uniforms.uAlphaFactor.value = (offset + Math.min(Math.abs(Math.sin(graphics.dirX)) + maxDst / dstToCore, 1)) / (1 + offset);
	}
}

/**
 * Función para liberar de la memoria del módulo.
 */
export function destroy() {
	galaxyControl.destroy();
	
	galaxyEffectTravel.destroy();
	
	destroyStar();
	destroyDust();
	destroySelectStar();
	destroyPointer();
}

/**
 * Función para liberar de la memoria las estrellas.
 */
function destroyStar() {
	// Representación gráfica.
	starTextures[0].dispose();
	starTextures[1].dispose();
	starMaterial.dispose();
	for (let i = 0; i < N_ARMS; ++i) {
		starGeometries[i].dispose();
		view.scene.remove(starMeshes[i]);
	}
}

/**
 * Función para liberar de la memoria el polvo cósmico.
 */
function destroyDust() {
	// Representación gráfica.
	dustTextures[0].dispose();
	dustTextures[1].dispose();
	dustTextures[2].dispose();
	dustMaterial.dispose();
	for (let i = 0; i < N_ARMS; ++i) {
		dustGeometries[i].dispose();
		view.scene.remove(dustMeshes[i]);
	}
}
