/**
  * Módulo para el mostrado de la escena de un sistema estelar.
  */

import * as THREE from '/js/libs/three.module.js';
import * as perlin from '/js/libs/perlin.js';

import * as graphics from '/js/graphics/graphics.js';
import * as keyboard from '/js/keyboard/keyboard.js';
import * as random from '/js/random/random.js';

import * as nameGenerator from '/js/game/name-generator.js';

import * as galaxy from '/js/game/scene/galaxy.js';

import * as starSystemControl from '/js/game/scene/starsystem-control.js'
import * as starSystemControlUi from '/js/game/scene/starsystem-control-ui.js';

/** Vista de renderizado del módulo. */
export let view;

/** Luz de la estrella. */
let starLight;
/** Luz de ambiente de la estrella. */
let ambientLight;

/** Textura de la estrella. */
let starTexture;
/** Material de la estrella. */
let starMaterial;
/** Geometry de la estrella. */
let starGeometry;
/** Mesh de la estrella. */
let starMesh;

/** Material de polvo de estrella. */
let starDustMaterial;
/** Geometría de polvo de estrella. */
let starDustGeometry;
/** Mesh de polvo de estrella. */
let starDustMesh;

/** Material de nube de estrella. */
let starCloudMaterial;
/** Geometría de nube de estrella. */
let starCloudGeometries = [];
/** Mesh de nube de estrella. */
let starCloudMeshes = [];

/** Texturas de estrella. */
let planetStarTextures = [];
/** Texturas de tierra. */
let planetDirtTextures = [];
/** Normales de tierra. */
let planetDirtNormals = [];
/** Texturas de agua. */
let planetWaterTextures = [];
/** Normales de agua. */
let planetWaterNormals = [];
/** Texturas de extraterrestre. */
let planetAlienTextures = [];
/** Normales de extraterrestre. */
let planetAlienNormals = [];
/** Texturas de nube. */
let planetCloudTextures = [];
/** Normales de nube. */
let planetCloudNormals = [];
/** Normal de crater. */
let planetCraterNormal;

/** Materiales de línea de los planetas. */
let planetLineMaterials = [];
/** Geometrias de línea de los planetas. */
let planetLineGeometries = [];
/** Meshes de linea de los planetas. */
let planetLineMeshes = [];

/** Materiales de tierra de los planetas. */
let planetGroundMaterials = [];
/** Geometrias de tierra de los planetas. */
let planetGroundGeometries = [];
/** Meshes de tierra de los planetas. */
let planetGroundMeshes = [];

/** Materiales de agua de los planetas. */
let planetWaterMaterials = [];
/** Geometrias de agua de los planetas. */
let planetWaterGeometries = [];
/** Meshes de agua de los planetas. */
let planetWaterMeshes = [];

/** Materiales de cielo 1 de los planetas. */
let planetCloud1Materials = [];
/** Geometrias de cielo 1 de los planetas. */
let planetCloud1Geometries = [];
/** Meshes de cielo 1 de los planetas. */
let planetCloud1Meshes = [];

/** Materiales de cielo 2 de los planetas. */
let planetCloud2Materials = [];
/** Geometrias de cielo 2 de los planetas. */
let planetCloud2Geometries = [];
/** Meshes de cielo 2 de los planetas. */
let planetCloud2Meshes = [];

/** Datos de planetas. */
export let planetData = [];

/** Grupo de la estrella. */
let groupStar = new THREE.Group();
/** Lista de grupos de planetas. */
export let groupPlanets = [];

/** Grupo del sistema. */
export let group = new THREE.Group();

/** Datos de la estrella actual. */
export let currentStar;

/** Fecha actual para la rotación y órbita de los planetas. */
let currentDate = 0;

/** Geometrias de colisción de los planetas */
let collisionGeometries = [];
/** Meshes de colisión de los planetas. */
export let collisionMeshes = [];
/** Grupo de colisión de los planetas. */
export let groupCollision = new THREE.Group();

/** Número de texturas para los planetas de cada grupo. */
const PLANET_TEXTURES = 5;
/** Número de texturas para las nubes. */
const CLOUD_TEXTURES = 2;
/** Número de texturas para las normales de cada grupo. */
const NORMAL_TEXTURES = 3;
/** Número de texturas para las normales de las nubes. */
const NORMAL_CLOUD_TEXTURES = 1;
/** Número de texture para las estrellas. */
const STAR_TEXTURES = 2;

/** Valor máximo de terraformación. */
const MAX_TERRAFORM_LEVEL = 2;

/** Número máximo de planetas. */
export const MAX_PLANETS = 10;

/** Luz ambiental. */
const AMBIENT_LIGHT = 0x505050;

/** Color máximo de líneas de terraformación. */
const MAX_LINE_COLOR = 0.65;
/** Color mínimo de líneas de terraformación. */
const MIN_LINE_COLOR = 0.15;

/**
  * Función de inicialización del módulo.
  */
export function init() {
	// Crear escena.
	view = graphics.createView(true, starSystemControl.cameraOnUpdate);
	
	// Inicializar controles.
	starSystemControl.init();
	
	// Inicializar representación gráfica.
	initResources();
	
	// Inicializar colisiones.
	initCollisions();
	
	// Añadir a la escena.
	view.scene.add(group);
}

/**
  * Función para la inicialización de recursos.
  */
function initResources() {
	/// Texturas.
	for (let i = 0; i < STAR_TEXTURES; ++i) {
		let texture = new THREE.TextureLoader().load('/image/star-system/star' + i + '.png');
		texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
		texture.minFilter = texture.magFilter = graphics.filtering;
		planetStarTextures.push(texture);
	}
	
	for (let i = 0; i < PLANET_TEXTURES; ++i) {
		{
			let texture = new THREE.TextureLoader().load('/image/star-system/dirt' + i + '.png');
			texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
			texture.minFilter = texture.magFilter = graphics.filtering;
			planetDirtTextures.push(texture);
		}
		{
			let texture = new THREE.TextureLoader().load('/image/star-system/water' + i + '.png');
			texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
			texture.minFilter = texture.magFilter = graphics.filtering;
			planetWaterTextures.push(texture);
		}
		{
			let texture = new THREE.TextureLoader().load('/image/star-system/alien' + i + '.png');
			texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
			texture.minFilter = texture.magFilter = graphics.filtering;
			planetAlienTextures.push(texture);
		}
	}
	for (let i = 0; i < CLOUD_TEXTURES; ++i) {
		let texture = new THREE.TextureLoader().load('/image/star-system/cloud' + i + '.png');
		texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
		texture.minFilter = texture.magFilter = graphics.filtering;
		planetCloudTextures.push(texture);
	}
	for (let i = 0; i < NORMAL_TEXTURES; ++i) {
		{
			let texture = new THREE.TextureLoader().load('/image/star-system/normals/normal-dirt' + i + '.png');
			texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
			texture.minFilter = texture.magFilter = graphics.filtering;
			planetDirtNormals.push(texture);
		}
		{
			let texture = new THREE.TextureLoader().load('/image/star-system/normals/normal-water' + i + '.png');
			texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
			texture.minFilter = texture.magFilter = graphics.filtering;
			planetWaterNormals.push(texture);
		}
		{
			let texture = new THREE.TextureLoader().load('/image/star-system/normals/normal-alien' + i + '.png');
			texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
			texture.minFilter = texture.magFilter = graphics.filtering;
			planetAlienNormals.push(texture);
		}
	}
	for (let i = 0; i < NORMAL_CLOUD_TEXTURES; ++i) {
		let texture = new THREE.TextureLoader().load('/image/star-system/normals/normal-cloud' + i + '.png');
		texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
		texture.minFilter = texture.magFilter = graphics.filtering;
		planetCloudNormals.push(texture);
	}
	
	planetCraterNormal = new THREE.TextureLoader().load('/image/star-system/normals/normal-crater.png');
	planetCraterNormal.wrapS = planetCraterNormal.wrapT = THREE.ClampToEdgeWrapping;
	planetCraterNormal.minFilter = planetCraterNormal.magFilter = graphics.filtering;
	
	/// Elementos.
	
	// Luces de estrella.
	starLight = new THREE.PointLight(0xFFFFFF, 1, 0, 2);
	starLight.position.set(0, 0, 0);
	group.add(starLight);
	
	ambientLight = new THREE.AmbientLight(AMBIENT_LIGHT);
	group.add(ambientLight);
	
	// Estrella.
	{
		{ // Forma principal.
			starMaterial = new THREE.MeshBasicMaterial({
				color: 0xFFFFFF,
				map: planetStarTextures[0]
			});
			
			starGeometry = new THREE.BoxGeometry(1, 1, 1, 12, 12, 12);
			
			let positions = starGeometry.attributes.position.array;
			for (let i = 0; i < positions.length; i += 3) {
				let x = positions[i];
				let y = positions[i + 1];
				let z = positions[i + 2];
				
				// Aplicar valores al vértice.
				let vertex = new THREE.Vector3(x, y, z);
				vertex.normalize().multiplyScalar(1);
				
				positions[i] = vertex.x;
				positions[i + 1] = vertex.y;
				positions[i + 2] = vertex.z;
			}
			starGeometry.attributes.position.needsUpdate = true;
			
			starMesh = new THREE.Mesh(starGeometry, starMaterial);
			group.add(starMesh);
		}
		{
			starDustMaterial = new THREE.ShaderMaterial({
				uniforms: {
					uColor: { value: new THREE.Vector3(1, 1, 1) }
				},
				
				vertexShader: `
					attribute float aSize;
					
					varying vec2 vUv;
					
					void main() {
						vUv = uv;
						
						vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

						gl_Position = projectionMatrix * mvPosition;
					}
				`,
				fragmentShader: `
					uniform vec3 uColor;
					
					varying vec2 vUv;
					
					void main() {
						float pointX = (vUv.x - 0.5f) * 2.0f;
						float pointY = (vUv.y - 0.5f) * 2.0f;
						float distance = (1.0f - sqrt(pointX * pointX + pointY * pointY));
						//distance = min(distance, 0.3f);
						//distance *= Math.abs(distance);
						
						gl_FragColor = vec4(distance, distance, distance, 1.0f) * vec4(uColor, 1);
					}
				`,
				blending: THREE.AdditiveBlending,
				depthTest: false,
				depthWrite: false
			});
			
			// Geometría.
			starDustGeometry = new THREE.PlaneGeometry(1, 1);
			
			// Mesh.
			starDustMesh = new THREE.Mesh(starDustGeometry, starDustMaterial);
			
			
			group.add(starDustMesh);
		}
		
		{ // Nubes de estrella.
			starCloudMaterial = new THREE.MeshBasicMaterial(
				{
					//map: planetCloudTextures[0],
					//map: planetStarTextures[1],
					map: planetCloudTextures[1],
					opacity: 0.25,
					transparent: true,
					blending: THREE.AdditiveBlending
				}
			);
			
			for (let i = 0; i < 20; ++i){
				let cloudGeometry1 = new THREE.BoxGeometry(1, 1, 1, 32, 32, 32);
				let positions = cloudGeometry1.attributes.position.array;
				for (let u = 0; u < positions.length; u += 3) {
					let x = positions[u];
					let y = positions[u + 1];
					let z = positions[u + 2];
					
					// Aplicar valores al vértice.
					let vertex = new THREE.Vector3(x, y, z);
					vertex.normalize().multiplyScalar(1/*37.1 + i / 20*/);
					
					positions[u] = vertex.x;
					positions[u + 1] = vertex.y;
					positions[u + 2] = vertex.z;
				}
				cloudGeometry1.attributes.position.needsUpdate = true;
				starCloudGeometries.push(cloudGeometry1);
				
				let cloudMesh1 = new THREE.Mesh(cloudGeometry1, starCloudMaterial);
				cloudMesh1.rotation.x = Math.random();
				cloudMesh1.rotation.y = Math.random();
				cloudMesh1.rotation.z = Math.random();
				starCloudMeshes.push(cloudMesh1);
				
				group.add(cloudMesh1);
			}
		}
	}
	
	// Planetas.
	for (let i = 0; i < MAX_PLANETS; ++i) {
		let planet = new THREE.Group();
		groupPlanets.push(planet);
		group.add(planet);
		
		// Líneas de planetas.
		let lineMaterial = new THREE.LineBasicMaterial(
			{
				color: 0xFFFFFF,
				blending: THREE.AdditiveBlending,
				depthTest: false,
				transparent: true,
				vertexColors: true
			}
		);
		planetLineMaterials.push(lineMaterial);
		
		let points = [];
		let colors = [];
		let limit = Math.PI * 2 / 4; // Longitud máxima de la línea de órbita.
		let limitStart = limit / 5; // Límite de degradado inicial para el color de la línea.
		for (let i = 0; i <= limit; i += Math.PI * 2 / 90) {
			// Posiciones.
			points.push(Math.sin(i), 0, Math.cos(i));
			
			// Color.
			let color = 0;
			if (i != 0) {
				if (i < limitStart) {
					color = 0.15 + i / limitStart;
				} else {
					color = 1 - i / limit;
				}
			}
			// Limitar color.
			if (color > 1) {
				color = 1;
			} else if (color < 0) {
				color = 0;
			}
			
			colors.push(color, color, color);
		}
		let lineGeometry = new THREE.BufferGeometry();//.setFromPoints(points);
		lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
		lineGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
		lineGeometry.computeBoundingSphere();
		
		planetLineGeometries.push(lineGeometry);
		
		let lineMesh = new THREE.Line(lineGeometry, lineMaterial);
		planetLineMeshes.push(lineMesh);
		
		group.add(lineMesh);
		
		// Tierra de planetas.
		let groundMaterial = new THREE.MeshPhongMaterial(
			{
				//color: Math.floor(random.get() * 0xFFFFFF),
				//map: planetDirtTextures[Math.floor(random.get() * PLANET_TEXTURES)],
				shininess: 25,
				//bumpMap: planetDirtNormals[Math.floor(random.get() * NORMAL_TEXTURES)],
				bumpScale: 0.10
			}
		);
		planetGroundMaterials.push(groundMaterial);
		
		let groundGeometry = new THREE.BoxGeometry(1, 1, 1, 32, 32, 32);
		planetGroundGeometries.push(groundGeometry);
		
		let groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
		groundMesh.receiveShadow = true;
		planetGroundMeshes.push(groundMesh);
		
		planet.add(groundMesh);
		
		// Agua de planetas.
		let waterMaterial = new THREE.MeshPhongMaterial(
			{
				//color: Math.floor(random.get() * 0xFFFFFF),
				//map: planetWaterTextures[Math.floor(random.get() * PLANET_TEXTURES)],
				opacity: 0.75,
				transparent: true,
				shininess: 100,
				//bumpMap: planetWaterNormals[Math.floor(random.get() * NORMAL_TEXTURES)],
				bumpScale: 0.07
			}
		);
		planetWaterMaterials.push(waterMaterial);
		
		let waterGeometry = new THREE.BoxGeometry(1, 1, 1, 32, 32, 32);
		planetWaterGeometries.push(waterGeometry);
		
		let waterMesh = new THREE.Mesh(waterGeometry, waterMaterial);
		waterMesh.receiveShadow = true;
		planetWaterMeshes.push(waterMesh);
		
		planet.add(waterMesh);
		
		// Nube de planetas 1.
		let cloudMaterial1 = new THREE.MeshPhongMaterial(
			{
				//map: planetCloudTextures[0],
				opacity: 0.90,
				transparent: true,
				shininess: 50,
				//bumpMap: planetCloudNormals[0],
				bumpScale: 0.1
			}
		);
		planetCloud1Materials.push(cloudMaterial1);
		
		let cloudGeometry1 = new THREE.BoxGeometry(1, 1, 1, 32, 32, 32);
		planetCloud1Geometries.push(cloudGeometry1);
		
		let cloudMesh1 = new THREE.Mesh(cloudGeometry1, cloudMaterial1);
		cloudMesh1.receiveShadow = true;
		planetCloud1Meshes.push(cloudMesh1);
		
		planet.add(cloudMesh1);
		
		// Nube de planetas 2.		
		let cloudMaterial2 = new THREE.MeshPhongMaterial(
			{
				//map: planetCloudTextures[1],
				opacity: 0.70,
				transparent: true,
				shininess: 50,
				//bumpMap: planetCloudNormals[0],
				bumpScale: 0.1
			}
		);
		planetCloud2Materials.push(cloudMaterial2);
		
		let cloudGeometry2 = new THREE.BoxGeometry(1, 1, 1, 32, 32, 32);
		planetCloud2Geometries.push(cloudGeometry2);
		
		let cloudMesh2 = new THREE.Mesh(cloudGeometry2, cloudMaterial2);
		cloudMesh2.receiveShadow = true;
		planetCloud2Meshes.push(cloudMesh2);
		
		planet.add(cloudMesh2);
	}	
}

/**
  * Función para inicializar las colisiones de los planetas.
  */
function initCollisions() {
	// Planetas (y estrella +1).
	for (let i = 0; i < MAX_PLANETS + 1; ++i) {
		let geometry = new THREE.SphereGeometry(1, 12, 6);
		collisionGeometries.push(geometry);
		
		let mesh = new THREE.Mesh(geometry, undefined);
		mesh.name = i;
		mesh.visible = false;
		collisionMeshes.push(mesh);
		
		groupCollision.add(mesh);
		
		view.scene.add(groupCollision);
	}
}

/**
  * Función para la generación del sistema estelar.
  *
  * @param seed la semilla del sistema estelar.
  * @param data los datos de la estrella.
  */
export function generateStarSystem(seed, data) {
	// Establecer nueva semilla.
	random.setSeed(seed);
	
	// Setear datos de la estrella.
	setCurrentStar(data);
	
	// Generar datos de los planetas.
	planetData = generatePlanetData(data);
	
	// Añadir estrella.
	generateStar(data);
	
	// Añadir planetas.
	//let distanceToStar = 50;
	for (let i = 0; i < MAX_PLANETS; ++i) {
		/*// Datos del planeta.
		distanceToStar += 30 + random.get() * 30;
		
		let data = {
			index: i,
			distanceToStar: distanceToStar,
			size: 0.5 + random.get() * 1.5,
			speed: (1.5 * random.get() + 0.5) * random.get() > 0.5 ? 1 : -1,
			speedRot: (1.5 * random.get() + 0.5) * random.get() > 0.5 ? 1 : -1,
			dir: random.get() * Math.PI * 2,
			terraformLevel: Math.round(random.get() * MAX_TERRAFORM_LEVEL),
			visible: (random.get() > 0.5)
		};
		planetData[i] = data;*/
		
		if (planetData[i].visible) {
			generatePlanet(i, seed * MAX_PLANETS + i, planetData[i]);
			
			collisionMeshes[i].scale.set(10 * planetData[i].size, 10 * planetData[i].size, 10 * planetData[i].size);
			planetLineMeshes[i].visible = true;
			groupPlanets[i].visible = true;
		} else {
			collisionMeshes[i].scale.set(0, 0, 0);
			planetLineMeshes[i].visible = false;
			groupPlanets[i].visible = false;
		}
	}
}

/**
  * Función para generar los datos de los planetas.
  *
  * @param data los datos de la estrella.
  * @return lista con los datos nuevos del planeta.
  */
export function generatePlanetData(data) {
	let newPlanetData = [];
	
	let distanceToStar = 50;
	for (let i = 0, u = 1; i < MAX_PLANETS; ++i) {
		// Datos del planeta.
		distanceToStar += 30 + random.get() * 30;
		
		let thisPlanetData = {
			index: i,
			name: nameGenerator.generateWithouthNumber(),
			distanceToStar: distanceToStar,
			size: 0.5 + random.get() * 1.5,
			speed: (1.5 * random.get() + 0.5) * random.get() > 0.5 ? 1 : -1,
			speedRot: (1.5 * random.get() + 0.5) * random.get() > 0.5 ? 1 : -1,
			dir: random.get() * Math.PI * 2,
			terraformLevel: Math.round(random.get() * MAX_TERRAFORM_LEVEL),
			visible: (random.get() > 0.5)
		};
		newPlanetData[i] = thisPlanetData;
		
		if (newPlanetData[i].visible) {
			++u;
		}
	}
	
	return newPlanetData;
}

/**
  * Función para generar la estrella.
  *
  * @param data los datos de la estrella.
  */
function generateStar(data) {
	const RADIUS = 37 + random.get() * 15;
	
	// Representación gráfica.
	starDustMaterial.uniforms.uColor.r = starCloudMaterial.color.r = starLight.color.r = starMaterial.color.r = 0.5 + data.r * 0.5;
	starDustMaterial.uniforms.uColor.g = starCloudMaterial.color.g = starLight.color.g = starMaterial.color.g = 0.5 + data.g * 0.5;
	starDustMaterial.uniforms.uColor.b = starCloudMaterial.color.b = starLight.color.b = starMaterial.color.b = 0.5 + data.b * 0.5;
	
	starDustMesh.scale.set(RADIUS * 2.75, RADIUS * 2.75, RADIUS * 2.75);
	
	for (let i = 0; i < starCloudMeshes.length; ++i) {
		let mesh = starCloudMeshes[i];
		
		mesh.scale.set(RADIUS + 0.1 + i / 20, RADIUS + 0.1 + i / 20, RADIUS + 0.1 + i / 20);
	}
	
	starMesh.scale.set(RADIUS, RADIUS, RADIUS);
	
	// Colisión.
	collisionMeshes[MAX_PLANETS].scale.set(RADIUS, RADIUS, RADIUS);
}

/**
  * Función para la generacíon de un planeta.
  *
  * @param index el índice del planeta.
  * @param seed la semilla del planeta.
  * @param data los datos del planeta.
  */
function generatePlanet(index, seed, data) {
	// Línea.
	// Multiplicar X por velocidad para que vaya acorde a su dirección.
	planetLineMeshes[index].scale.set(data.distanceToStar * Math.sign(data.speed), data.distanceToStar, data.distanceToStar);
	planetLineMaterials[index].color.r = data.terraformLevel == 0 ? MAX_LINE_COLOR : MIN_LINE_COLOR;
	planetLineMaterials[index].color.g = data.terraformLevel == 2 ? MAX_LINE_COLOR : MIN_LINE_COLOR;
	planetLineMaterials[index].color.b = data.terraformLevel == 1 ? MAX_LINE_COLOR : MIN_LINE_COLOR;
	
	/// Ground.
	planetGroundMaterials[index].color.r = random.get();
	planetGroundMaterials[index].color.g = random.get();
	planetGroundMaterials[index].color.b = random.get();
	planetGroundMaterials[index].map = planetDirtTextures[Math.floor(random.get() * PLANET_TEXTURES)];
	planetGroundMaterials[index].bumpMap = planetDirtNormals[Math.floor(random.get() * NORMAL_TEXTURES)];
	
	if (data.terraformLevel < 2) {
		planetGroundMaterials[index].normalMap = planetCraterNormal;
		planetGroundMaterials[index].normalScale = new THREE.Vector2(0.2, 0.2);
	} else {
		planetGroundMaterials[index].normalMap = undefined;
		planetGroundMaterials[index].normalScale = undefined;
	}
	
	generatePlanetGeometry(planetGroundGeometries[index], 10 * data.size, 1, seed);
	
	/// Water.
	if (data.terraformLevel > 1) {
		planetWaterMaterials[index].color.r = random.get();
		planetWaterMaterials[index].color.g = random.get();
		planetWaterMaterials[index].color.b = random.get();
		planetWaterMaterials[index].map = planetWaterTextures[Math.floor(random.get() * PLANET_TEXTURES)];
		planetWaterMaterials[index].bumpMap = planetWaterNormals[Math.floor(random.get() * NORMAL_TEXTURES)];
		generatePlanetGeometry(planetWaterGeometries[index], 10.01 * data.size, 0, seed);
		
		planetWaterMeshes[index].visible = true;
	} else {
		planetWaterMeshes[index].visible = false;
	}
	
	//// Clouds.
	let cloudIntesity = 0.8;
	let cloudColor = {
		r: cloudIntesity + random.get() * (1 - cloudIntesity),
		g: cloudIntesity + random.get() * (1 - cloudIntesity),
		b: cloudIntesity + random.get() * (1 - cloudIntesity)
	};
	
	/// Cloud 1.
	if (data.terraformLevel > 1) {
		planetCloud1Materials[index].map = planetCloudTextures[0];
		planetCloud1Materials[index].bumpMap = planetCloudNormals[0];
		planetCloud1Materials[index].color.r = cloudColor.r;
		planetCloud1Materials[index].color.g = cloudColor.g;
		planetCloud1Materials[index].color.b = cloudColor.b;
		generatePlanetGeometry(planetCloud1Geometries[index], 10.51 * data.size, 0, seed);
		
		planetCloud1Meshes[index].visible = true;
	} else {
		planetCloud1Meshes[index].visible = false;
	}
	
	/// Cloud 2.
	if (data.terraformLevel > 0) {
		planetCloud2Materials[index].map = planetCloudTextures[1],
		planetCloud2Materials[index].bumpMap = planetCloudNormals[0],
		planetCloud2Materials[index].color.r = cloudColor.r;
		planetCloud2Materials[index].color.g = cloudColor.g;
		planetCloud2Materials[index].color.b = cloudColor.b;
		generatePlanetGeometry(planetCloud2Geometries[index], 10.61 * data.size, 0, seed);
		
		planetCloud2Meshes[index].visible = true;
	} else {
		planetCloud2Meshes[index].visible = false;
	}
}

/**
  * Función de útil para generar la geometria de un planeta, de acuerdo a un radio, factor de elevación y semilla.
  * La semilla se usará para estrablecer la semilla de generación aleatoria del algoritmo de perlin.js
  * La geometria consiste en un cubo cuyas coordenadas de vértices han sido normalizados para conseguir una esfera.
  *
  * @param geometry la geometria a modificar.
  * @param radius el radio del planeta.
  * @param elevationFactor cuento afecta las elevaciones al planeta.
  * @param seed la semilla.
  */
function generatePlanetGeometry(geometry, radius, elevationFactor, seed) {
	// Establecer semilla.
	perlin.module.seed(seed);
	
	// Modificar mesh.
	let positions = geometry.attributes.position.array;
	
	for (let i = 0; i < positions.length; i += 3) {
		let x = positions[i];
		let y = positions[i + 1];
		let z = positions[i + 2];
		
		// Aplicar valores al vértice.
		let vertex = new THREE.Vector3(x, y, z);
		vertex.normalize();
		x = vertex.x;
		y = vertex.y;
		z = vertex.z;
		
		let elevation = 0;
		if (elevationFactor != 0) {
			// Calcular elevación.
			let dst = Math.sqrt(x * x + y * y + z * z);
			let dstXZ = Math.sqrt(x * x + z * z);
			let dirX = Math.atan2(dstXZ, y);
			let dirY = Math.atan2(x, z);
			elevation = 0;
			elevation += perlin.module.perlin2(dirX * 3, dirY * 3) / 6;
			elevation += perlin.module.perlin2(dirX / 2, dirY / 2) / 4;
			//elevation += perlin.module.perlin2(dirX * 3, dirY * 3) / 3;
			//elevation += perlin.module.perlin2(dirX / 2, dirY / 2) / 2;
			//elevation += perlin.module.perlin2(dirX / 10, dirY / 10);
		}
		
		vertex.multiplyScalar(radius + elevation * elevationFactor);
		
		positions[i] = vertex.x;
		positions[i + 1] = vertex.y;
		positions[i + 2] = vertex.z;
	}
	
	geometry.attributes.position.needsUpdate = true;
	geometry.computeVertexNormals();
}

/**
  * Función de bucle del módulo.
  */
export function update() {
	// Procesamiento de los controles.
	starSystemControl.update();
	
	// Procesamiento de planetas.
	updatePlanets();
}

/**
  * Función para actualizar datos de los planetas.
  */
function updatePlanets() {
	currentDate += 1; // Placeholder: Obtener fecha en el servidor.
	
	// Efecto de agua.
	for (let i = 0; i < planetWaterMeshes.length; ++i) {
		let mesh = planetWaterMeshes[i];
		
		mesh.rotation.x += 0.0003;
		mesh.rotation.y += 0.001;
		mesh.rotation.z += 0.002;
	}
	
	// Efecto de nubes.
	for (let i = 0; i < planetCloud1Meshes.length; ++i) {
		let mesh = planetCloud1Meshes[i];
		
		mesh.rotation.x += 0.001;
		mesh.rotation.y += 0.002;
		mesh.rotation.z += 0.0003;
	}
	for (let i = 0; i < planetCloud2Meshes.length; ++i) {
		let mesh = planetCloud2Meshes[i];
		
		mesh.rotation.x += 0.001;
		mesh.rotation.y -= 0.0003;
		mesh.rotation.z -= 0.002;
	}
	
	// Mover planetas.
	for (let i = 0; i < groupPlanets.length; ++i) {
		let planetGroup = groupPlanets[i];
		let data = planetData[i];
		
		if (data != undefined) {
			// Rotación de la órbita en radianes.
			let direction = data.dir + currentDate * data.speed / 5750;
			
			planetGroup.position.x = Math.sin(direction) * data.distanceToStar;
			planetGroup.position.y = 0;
			planetGroup.position.z = Math.cos(direction) * data.distanceToStar;
			
			planetGroup.rotation.y = currentDate * data.speedRot / 1500 * Math.PI * 2;
			
			// Desplazar línea de órbita.
			planetLineMeshes[i].rotation.y = direction;
		}
	}
	
	// Mover colisiones de planetas.
	for (let i = 0; i < MAX_PLANETS; ++i) {
		let planetGroup = groupPlanets[i];
		let collision = collisionMeshes[i];
		
		collision.position.x = planetGroup.position.x;
		collision.position.y = planetGroup.position.y;
		collision.position.z = planetGroup.position.z;
	}
	
	// Rotar estrella.
	starMesh.rotation.x += Math.cos(starMesh.rotation.y) / 1000;
	starMesh.rotation.y += 0.002;
	starMesh.rotation.z += 0.001;
	
	// Halo de luz.
	starDustMesh.lookAt(view.camera.position);
	
	// Rotar nubes de estrella.
	for (let i = 0; i < starCloudMeshes.length; ++i) {
		let mesh = starCloudMeshes[i];
		
		mesh.rotation.x -= 0.001;
		mesh.rotation.y -= 0.002;
		mesh.rotation.z += 0.003;
	}
}

/**
 * Función para liberar de la memoria del módulo.
 */
export function destroy() {
	starSytemControl.destroy();
	
	destroyResources();
	destroyStar();
	destroyPlanets();
	
	view.scene.remove(group);
}

/**
 * Función para liberar de la memoria los recursos.
 */
function destroyResources() {
	/// Texturas.
	for (let i = 0; i < planetDirtTextures.length; ++i) { planetDirtTextures[i].dipose(); }
	planetDirtTextures = [];
	
	for (let i = 0; i < planetWaterTextures.length; ++i) { planetWaterTextures[i].dipose(); }
	planetWaterTextures = [];
	
	for (let i = 0; i < planetAlienTextures.length; ++i) { planetAlienTextures[i].dipose(); }
	planetAlienTextures = [];
	
	for (let i = 0; i < planetCloudTextures.length; ++i) { planetCloudTextures[i].dipose(); }
	planetCloudTextures = [];
	
	for (let i = 0; i < planetDirtNormals.length; ++i) { planetDirtNormals[i].dipose(); }
	planetDirtNormals = [];
	
	for (let i = 0; i < planetWaterNormals.length; ++i) { planetWaterNormals[i].dipose(); }
	planetWaterNormals = [];
	
	for (let i = 0; i < planetAlienNormals.length; ++i) { planetAlienNormals[i].dipose(); }
	planetAlienNormals = [];
	
	for (let i = 0; i < planetCloudNormals.length; ++i) { planetCloudNormals[i].dipose(); }
	planetCloudNormals = [];
	
	planetCraterNormal.dispose();
	
	/// Elementos.
	starTexture.dispose();
	starMaterial.dispose();
}

/**
  * Settter currentStar.
  *
  * @param newDir el nuevo valor.
  */
export function setCurrentStar(value) {
	currentStar = structuredClone(value);
	
	// Actualizar estado de la UI.
	
	// Elemento base.
	let title = starSystemControlUi.goBackBox.querySelector('h1.star-title');
	title.innerHTML = ''; // Vaciar contenido de title.
	
	// Sub-elementos.
	let text = document.createElement('node');
	text.textContent = currentStar.name;
	
	let claiming = document.createElement('span');
	claiming.classList.add('muted');
	claiming.textContent = '(unclaimed)';
	
	// Añadir sub-elementos.
	title.append(text);
	title.append(claiming);
}

/**
  * Gettter para obtener semilla con la generar estrellas a través del brazo e índice de la estrella en la galaxia.
  *
  * @param armIndex índice del brazo a la que la estrella pertenece.
  * @param index índice de la estrella en el brazo.
  * @return la semilla para generar estrellas..
  */
export function getStarGenerationSeed(armIndex, index) {
	return (armIndex * 123456 + index * 3728) * galaxy.seed;
}
