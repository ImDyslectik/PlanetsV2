import "./style.css";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import Stats from "three/examples/jsm/libs/stats.module.js";

let camera,
	container,
	scene,
	renderer,
	overlay,
	startButton,
	createCanvasTexture,
	createEmissiveMap,
	gltfLoader,
	textureLoader;
let planets = new THREE.Group(),
	son = new THREE.Group(),
	sideObj = new THREE.Group(),
	firstPersonObj = new THREE.Group();
let max = 30;
let min = 2.5;
let scalerMax = 4;
let scalerMin = 0.5;
let scale = 1;
let mouseX = 0;
let mouseY = 0;
let planDist = 6;
let clock = new THREE.Clock();
var rngPosX;
var rngPosY;
var scaler;

startButton = document.getElementById("startButton");
startButton.addEventListener("click", main);

function main() {
	overlay = document.getElementById("overlay");
	overlay.remove();
	container = document.getElementById("container");
	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor(0xffffff);
	renderer.setPixelRatio(window.devicePixelRatio);
	container.appendChild(renderer.domElement);
	renderer.outputEncoding = THREE.RGBDEncoding;

	scene = new THREE.Scene();
	gltfLoader = new GLTFLoader();
	textureLoader = new THREE.TextureLoader();
	const sunNormal = textureLoader.load("/Textures/2k_sun.jpg");
	const earthNormal = textureLoader.load("/Textures/NormalMapEarthNight.png");
	const cross = textureLoader.load("/Textures/cross.png");
	const jupNormal = textureLoader.load("/Textures/NormalMapJupiter.png");
	const marsNormal = textureLoader.load("/Textures/NormalMapMars.png");
	const moonNormal = textureLoader.load("/Textures/NormalMap.png");
	const stats = Stats();
	const sizes = {
		width: window.innerWidth,
		height: window.innerHeight,
	};

	function initCanvas(){createCanvasTexture = function (draw) {
		const canvas = document.createElement("canvas"),
			emissiveCanvas = canvas.getContext("2d");
		draw(emissiveCanvas, canvas);
		return new THREE.CanvasTexture(canvas);
	};
	createEmissiveMap = function () {
		const emissiveMap = new THREE.Color(1, 1, 1);
		return createCanvasTexture(function (emissiveCanvas, canvas) {
			emissiveCanvas.strokeStyle = emissiveMap.getStyle();
			emissiveCanvas.strokeRect(1, 1, canvas.width - 1, canvas.height - 1);
		});
	};}
	initCanvas();
	
	function makeGalaxy(){
			const galaxySun = new THREE.PointsMaterial({
			size: 0.005,
		});
		const galaxymat = new THREE.PointsMaterial({
			size: 0.5,
			map: cross,
			transparent: true,
			color: "cyan",
		});
		const galaxymat2 = new THREE.PointsMaterial({
			size: 0.5,
			map: cross,
			transparent: true,
			color: "violet",
		});
		const galaxyGeo = new THREE.SphereBufferGeometry(20, 64, 32);
		const galaxyParticles = new THREE.BufferGeometry();
		const galaxyParticles2 = new THREE.BufferGeometry();

		const galaxyMesh = new THREE.Points(galaxyParticles, galaxymat);
		const galaxyMesh2 = new THREE.Points(galaxyParticles2, galaxymat2);
		const particlesCount = 50000;
		const posArray = new Float32Array(particlesCount * 3);
		const posArray2 = new Float32Array(particlesCount * 3);

		for (let i = 0; i < particlesCount * 3; i++) {
			posArray[i] = (Math.random() - 0.5) * (Math.random() * 100);
			posArray2[i] = (Math.random() - 0.5) * (Math.random() * 100);
		}
		galaxyParticles.setAttribute(
			"position",
			new THREE.BufferAttribute(posArray, 3)
		);
		galaxyParticles2.setAttribute(
			"position",
			new THREE.BufferAttribute(posArray2, 3)
		);
		const galaxy2 = new THREE.Points(galaxyGeo, galaxySun);
		const galaxy = new THREE.Points(galaxyGeo, galaxySun);
		scene.add(galaxy, galaxyMesh);
		scene.add(galaxy2, galaxyMesh2);
	}
	makeGalaxy();

	const geometry = new THREE.SphereBufferGeometry(0.5, 32, 32);
	geometry.createEmissiveMap = createEmissiveMap();
	const geometry1 = new THREE.SphereBufferGeometry(1, 32, 32);

	const material = new THREE.MeshStandardMaterial({ 
		color: 0xff5349,
		roughness: 1,
		metalness: 0.5,
		normalMap: sunNormal,
		emissive: new THREE.Color(1, 0, 0),
		emissiveIntensity: 1,
	});

	const material1 = new THREE.MeshStandardMaterial({
		color: 0xff69b4,
		normalMap: sunNormal,
		emissive: new THREE.Color(1, 105 / 255, 180 / 255),
		emissiveIntensity: 1,
	});
	material1.createEmissiveMap = createEmissiveMap()

	const planetGeo = new THREE.SphereBufferGeometry(scaler, 32, 32);
	const earthMat = new THREE.MeshToonMaterial({
		color: 0x49ef4,
		normalMap: earthNormal,
	});
	const Earth = new THREE.Mesh(planetGeo, earthMat);
	Earth.position.set(rngPosX, rngPosY, 15);

	document.addEventListener("mousemove", mouseMove, false);

	const url = "Objects/scene.gltf";
	gltfLoader.load(url, (gltf) => {
		const root = gltf.scene;
		root.scale.multiplyScalar(1 / 20);
		root.position.set(0, 1.5, -10);
		root.rotateY(1.55);
		root.receiveShadow = true;
		firstPersonObj.add(root);
		root.add(camera);
	});

	initPlanets();
	makeLights();
	loader();
	randomLight();
	randomPos();
	resize();
	audio();
	son.position.y = 4;
	scene.add(sideObj);
	scene.add(firstPersonObj);

	function initPlanets(){
		const moon = makePlanet(0.2, 32, 32, "grey", moonNormal, 0.2, 0.2, planDist);
		planets.add(moon);
	
		const mars = makePlanet(0.4, 32, 32, 0xbea7b2, marsNormal, -4, 4, 0);
		planets.add(mars);
	
		const jupiter = makePlanet(4, 32, 32, "brown", jupNormal, 6.5, -6.5, 0);
		planets.add(jupiter);

		const Pink = new THREE.Mesh(geometry1, material1);
		Pink.position.set(-3, 4, 20);
		planets.add(Pink);

		const L4 = new THREE.PointLight(0xff69b4, 100, 550, 20);
		L4.position.set(0, 1, 1);
		Pink.add(L4);
	
		const Sun = new THREE.Mesh(geometry, material);
		const Sun2 = new THREE.Mesh(geometry, material);

		const ringGeo = new THREE.SphereGeometry(1.6, 64, 32, 0, 0.04, 0, 10);
		const ringMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
		const planetRing = new THREE.Mesh(ringGeo, ringMat);
		planetRing.position.set(0, 1, 0);
		scene.add(son);
		scene.add(planetRing);
		scene.add(Pink);

		son.add(Sun);
		son.add(Sun2);
		son.add(jupiter);
		son.add(mars);
	}

	function loader() {
		for (let i = 0; i < 4; i++) {
			const posX =
				Math.floor(Math.random() * (scalerMax - scalerMin + 1)) + scalerMin;
			const gltfLoader2 = new GLTFLoader();
			const url2 = "Objects/scene.gltf";
			gltfLoader2.load(url2, (gltf2) => {
				const root2 = gltf2.scene;
				root2.scale.multiplyScalar(1 / 16);
				root2.position.set(posX - 3, 2, -10);
				root2.rotateY(1.75);
				sideObj.add(root2);
			});
		}
	}

	function resize(){
			window.addEventListener("resize", () => {
			sizes.width = window.innerWidth;
			sizes.height = window.innerHeight;
			camera.aspect = sizes.width / sizes.height;
			camera.updateProjectionMatrix();
			renderer.setSize(sizes.width, sizes.height);
			renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		});
	}

	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	renderer.setClearColor(new THREE.Color("#000000"), 1);

	document.body.appendChild(stats.dom);

	function tick() {
		const elapsedTime = clock.getElapsedTime();
		son.rotation.z = 0.2 * elapsedTime;

		Earth.rotation.z = 0.4 * elapsedTime;
		firstPersonObj.translateZ(0.02);
		sideObj.translateZ(0.002);
		renderer.render(scene, camera);
		stats.update();
		window.requestAnimationFrame(tick);
	}
	tick();
}
//-----------------------------------------------------//
// Seperate functions put outside of main()
//-----------------------------------------------------//

function makePlanet(
	radius,
	widthSegments,
	heightSegments,
	color,
	normalMap,
	x,
	y,
	z
) {
	const planetGeo = new THREE.SphereBufferGeometry(
		radius,
		widthSegments,
		heightSegments
	);

	const planetMat = new THREE.MeshStandardMaterial({
		color: color,
		normalMap: normalMap,
	});

	const planet = new THREE.Mesh(planetGeo, planetMat);
	planet.position.set(x, y, z);

	return planet;
}

function randomPos() {
	const planetCount = 30;
	textureLoader = new THREE.TextureLoader();
	const marsNormal = textureLoader.load("/Textures/NormalMapMars.png");
	for (let i = 0; i < planetCount; i++) {
		rngPosX = Math.floor(Math.random() * (max - min + 1)) + min;
		rngPosY = Math.floor(Math.random() * (max - min + 1)) + min;
		scaler =
			Math.floor(Math.random() * (scalerMax - scalerMin + 1)) + scalerMin;

		const planetMat = new THREE.MeshPhysicalMaterial({
			color: 0x49ef4,
			metalness: 0.9,
			clearcoat: 1.0,
			clearcoatRoughness: 0.1,
			roughness: 0.5,
			normalMap: marsNormal,
		});
		const planetGeo = new THREE.SphereBufferGeometry(scaler, 32, 32);
		const planet = new THREE.Mesh(planetGeo, planetMat);
		planet.position.set(-rngPosX, rngPosY, rngPosX + planDist);
		const planeten = new THREE.Group(planetGeo, planetMat);
		planeten.add(planet);
		scene.add(planeten);
	}
}

function randomLight() {
	const planetCount = 20;
	textureLoader = new THREE.TextureLoader();
	const marsNormal = textureLoader.load("/Textures/NormalMapMars.png");
	for (let i = 0; i < planetCount; i++) {
		rngPosX = Math.floor(Math.random() * (max - min + 1)) + min;
		rngPosY = Math.floor(Math.random() * (max - min - 1)) + min;
		scaler =
			Math.floor(Math.random() * (scalerMax - scalerMin + 1)) + scalerMin;

		const planetMat1 = new THREE.MeshPhysicalMaterial({
			color: 0xffffff,
			metalness: 0.9,
			clearcoat: 1.0,
			clearcoatRoughness: 0.1,
			roughness: 0.5,
			normalMap: marsNormal,
			emissive: new THREE.Color(1, 0, 0),
			emissiveIntensity: 1,
		});
		const planetGeo1 = new THREE.SphereBufferGeometry(scaler, 32, 32);
		const planet1 = new THREE.Mesh(planetGeo1, planetMat1);
		const planeten1 = new THREE.Group(planetGeo1, planetMat1);

		const ambientLight = new THREE.AmbientLight("grey", 0.1);
		ambientLight.position.set(1, 1, 2);
		scene.add(ambientLight);
		planeten1.add(planet1);
		planet1.position.set(rngPosX, rngPosY, planDist * rngPosX);
		scene.add(planeten1);
	}
}

function mouseMove(event) {
	mouseX = -(event.clientX / window.innerWidth) * 10 + 1;
	mouseY = +(event.clientY / window.innerHeight) * 10 + 1;
	camera.rotation.x = mouseY / scale;
	camera.rotation.y = mouseX / scale;
}

function audio(){
	const sizes = {
		width: window.innerWidth,
		height: window.innerHeight,
	};
	camera = new THREE.PerspectiveCamera(
		100,
		sizes.width / sizes.height,
		0.1,
		200
	);
	camera.position.set(11.5, 2, 0.5, 5000);

	const listener = new THREE.AudioListener();
	camera.add(listener);
	const sound = new THREE.Audio(listener);
	const audiPlayer = new THREE.AudioLoader();
	//verander cosmic met : Imperialz
	audiPlayer.load("Music/cosmic.mp3", function (buffer) {
		sound.setLoop(true);
		sound.setBuffer(buffer);
		sound.setVolume(0.05);
		sound.play();
	});
}

function makeLights(){
	const L1 = new THREE.PointLight(0xff0000, 10, 500, 10);
	L1.position.set(0, -5, 0, 1);
	const L2 = new THREE.PointLight(0xffa500, 10, 500, 5);
	L2.position.set(0, 4, 0, 1.5);
	const L3 = new THREE.PointLight(0xffffff, 1, 500, 7);
	L3.position.set(0, 10, 0, 1.5);
	

	const pointlighthelper = new THREE.PointLightHelper(L2, 1);
	const lights = new THREE.Group();
	lights.add(pointlighthelper);
	lights.add(L1);
	lights.add(L2);
	lights.add(L3);
	scene.add(lights);
}