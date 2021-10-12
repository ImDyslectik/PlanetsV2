import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
 
// Debug


//afbeelding textures en texture lader
const textureLoader = new THREE.TextureLoader()
const sunNormal = textureLoader.load('/Textures/2k_sun.jpg')
const earthNormal = textureLoader.load('/Textures/NormalMapEarthNight.png')
const cross = textureLoader.load('/Textures/cross.png')
const jupNormal = textureLoader.load('/Textures/NormalMapJupiter.png')
const marsNormal = textureLoader.load('/Textures/NormalMapMars.png')
const moonNormal = textureLoader.load('/Textures/NormalMap.png')

// Canvas
const canvas = document.querySelector('canvas.webgl')
const createCanvasTexture = function (draw) {
    const canvas = document.createElement('canvas'),
    emissiveCanvas = canvas.getContext('2d');
    draw(emissiveCanvas, canvas);
    return new THREE.CanvasTexture(canvas);
};
const createEmissiveMap = function(){
    const emissiveMap = new THREE.Color(1, 1, 1);
    return createCanvasTexture(function (emissiveCanvas, canvas) {
        emissiveCanvas.strokeStyle = emissiveMap.getStyle();
        emissiveCanvas.strokeRect(1, 1, canvas.width - 1, canvas.height - 1);
    });
};

// Scene
const scene = new THREE.Scene();
{
  const color = 0xbea7b2;  
  const near = 5;
  const far = 80;
  scene.fog = new THREE.Fog(color, near, far);
}

//maakt galaxy aan
const galaxySun = new THREE.PointsMaterial({
    size:0.005,
})
const galaxymat = new THREE.PointsMaterial({
    size:0.007,
    map:cross,
    transparent:true,
    color: 'cyan',
})
const galaxymat2 = new THREE.PointsMaterial({
    size:0.01,
    map:cross,
    transparent:true,
    color: 'violet',
})
const galaxymat3 = new THREE.PointsMaterial({
    size:0.01,
    transparent:false,
    color: 'grey',
})
const listener = new THREE.AudioListener();


/*elke planeet heeft een ...Geo dus geometry met positie en de hoeken van de cirkel
* daarnaast hebben ze een mesh ofterwel een mat(eriaal) met de kleur en eigenschappen maar die heb ik eronder gezet
* tot slot komt het samen tot de planeetmesh waarin dus bovenstaande eigenschappen worden meegegeven
* en zon 1 en 2 hebben een emmisive map en emmision als eigenschap zodat het lijkt alsof het een zon is/ meer gloeit
* en zon 2 heeft identieke eigenschappen en dezelfde locatie zodat de 2 spheres door elkaar heen clippen wat er best wel cool uitziet
*/

//Zon
const sunGeo = new THREE.SphereBufferGeometry(.3,32,32)
const sunMat = new THREE.MeshStandardMaterial({color : 0xff5349})
const Sun = new THREE.Mesh(sunGeo,sunMat)
sunMat.roughness = 1,sunMat.metalness = 0.5,sunMat.normalMap = sunNormal;
sunMat.emissive = new THREE.Color(1, 1, 0),
sunMat.emissiveIntensity = 1;
sunGeo.createEmissiveMap = createEmissiveMap()

//Zon 2
const sun2Geo = new THREE.SphereBufferGeometry(.3,32,32)
const sun2Mat = new THREE.MeshStandardMaterial({color : 0xff5349})
const Sun2 = new THREE.Mesh(sun2Geo,sun2Mat)
sun2Mat.flatShading = true;
sun2Mat.emissive = new THREE.Color(1, 0, 0),
sun2Mat.emissiveIntensity = 1;
sun2Geo.createEmissiveMap = createEmissiveMap()

//Aarde
const earthGeo = new THREE.SphereBufferGeometry(.1,32,32)
const earthMat = new THREE.MeshPhongMaterial({color : 0x49ef4})
const Earth = new THREE.Mesh(earthGeo,earthMat)
Earth.position.x = 0.5,Earth.position.y = 0.5,Earth.position.z = 0.5;
earthMat.normalMap = earthNormal;

//Maan
const moonGeo = new THREE.SphereBufferGeometry(.02,32,32)
const moonMat = new THREE.MeshStandardMaterial({color : 'grey'})
const Moon = new THREE.Mesh(moonGeo,moonMat)
Moon.position.x = 0.1,Moon.position.y = 0.1;
moonMat.normalMap = moonNormal;

//Mars
const marsGeo = new THREE.SphereBufferGeometry(.1,32,32)
const marsMat = new THREE.MeshStandardMaterial({color : 0xbea7b2})
const Mars = new THREE.Mesh(marsGeo,marsMat)
Mars.position.x = -1,Mars.position.y = 1
marsMat.normalMap = marsNormal;

//Jupiter
const jupiterGeo = new THREE.SphereBufferGeometry(.3,32,32)
const jupiterMat = new THREE.MeshStandardMaterial({color : 'brown'})
const Jupiter = new THREE.Mesh(jupiterGeo,jupiterMat)
Jupiter.position.x = 1.5,Jupiter.position.y = -1.5,jupiterMat.normalMap = jupNormal;

//Saturn
const saturnGeo = new THREE.SphereBufferGeometry(.3,32,32)
const saturnMat = new THREE.MeshStandardMaterial({color : 'white'})
const Saturn = new THREE.Mesh(saturnGeo,saturnMat)
Saturn.position.x = -2.5,Saturn.position.y = 1;
saturnMat.roughness = 1,saturnMat.metalness = 1;

//Saturn ring
const saturnRingGeo = new THREE.SphereGeometry( .4,64,32,0,.04,0,10 );
const saturnRingMat = new THREE.MeshBasicMaterial( { color: 0xffffff} );
const saturnRing = new THREE.Mesh( saturnRingGeo, saturnRingMat );

//galaxy background 1
const galaxyGeo = new THREE.SphereBufferGeometry(3.5,64,32)
const galaxyParticles = new THREE.BufferGeometry;
const galaxyMesh = new THREE.Points(galaxyParticles,galaxymat)
const particlesCount = 20000;
const posArray = new Float32Array(particlesCount * 3);
for(let i = 0; i<particlesCount *3; i++){
    posArray[i] = (Math.random() - 0.5) * (Math.random() * 5)
}
galaxyParticles.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
const galaxy = new THREE.Points(galaxyGeo,galaxySun)

//galaxy background 2
const galaxyGeo2 = new THREE.SphereBufferGeometry(3.5,64,32)
const galaxyParticles2 = new THREE.BufferGeometry;
const galaxyMesh2 = new THREE.Points(galaxyParticles2,galaxymat2)
galaxyParticles2.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
const galaxy2 = new THREE.Points(galaxyGeo2,galaxySun)

//inladen van objecten
const loader = new OBJLoader();
loader.load('Objects/Star_destroyer.obj',
	function ( object ) {
       object.position.x = 0
       object.position.y = 3
       object.position.z = -20
       object.scale.multiplyScalar(1)
       scene.add( object );
    render();
	},
);

/*onderstaande voegt alle objecten toe aan de scene
*sun.add voegt dingen aan de zon toe zodat ze rond draaien
*#planeetnaam.add(#andereplaneet) voegt objecten aan planeten toe zodat er om de planeten ook een planeet kan draaien*/
scene.add(Sun)
scene.add(Sun2)
scene.add(galaxy,galaxyMesh)
scene.add(galaxy2,galaxyMesh2)
Sun.add(Earth)
Sun.add(Jupiter)
Sun.add(Mars)
Sun2.add(Saturn)
Earth.add(Moon)
Saturn.add(saturnRing);

//al het debug spul wat ik heb gebruikt
//objects.psuh voegt alles objecten toe aan de lijst objects aangezien ik dan makkelijk de x y en z as kan zien voor debugen
//gui.addfolder maakt mapjes aan voor de lichten om te debuggen en aan te passen voordat ik het hard code

// const gui = new dat.GUI()
// const objects = [];

// objects.push(Earth)
// objects.push(Sun)
// objects.push(Moon)
// objects.push(Jupiter)
// objects.push(Mars)
// objects.forEach((node) => {
//     const axes = new THREE.AxesHelper();
//     axes.material.depthTest = false;
//     axes.renderOrder = 1;
//     node.add(axes);
//   });

// const light1 = gui.addFolder('Light 1')
// const light2 = gui.addFolder('Light 2')
// light1.add(pointLight.position,'y').min(-5).max(5).step(0.01),light1.add(pointLight.position,'x').min(-5).max(5).step(0.01);
// light1.add(pointLight.position,'z').min(-5).max(5).step(0.01),light1.add(pointLight,'intensity').min(0).max(10).step(0.01);
// light2.add(pointLight2.position,'y').min(-5).max(5).step(0.01),light2.add(pointLight2.position,'x').min(-5).max(5).step(0.01);
// light2.add(pointLight2.position,'z').min(-5).max(5).step(0.01),light2.add(pointLight2,'intensity').min(0).max(10).step(0.01);

/*maakt de lichten aan met kleur en afstand zodat het er mooi uitziet
* de pointlighthelper zijn in principe om te debuggen maar ik vind het wel mooi eruit zien dus heb ik het erin gelaten
* scene.add voegt hier de lichten toe
*/
const pointLight = new THREE.PointLight(0xff0000, 1,10)
pointLight.position.set(0,-5,0,1)
const pointLight2 = new THREE.PointLight(0xffffff, 1,21)
pointLight2.position.set(0,0,0,1.5)

const pojntlighthelper = new THREE.PointLightHelper(pointLight2, 1)
scene.add(pojntlighthelper)
scene.add(pointLight)
scene.add(pointLight2)

//maakt het formaat van het canvas ik weet alleen niet hoe je het moet resizen
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// window.addEventListener('resize', () =>
// {
//     sizes.width = window.innerWidth
//     sizes.height = window.innerHeight
//     camera.aspect = sizes.width / sizes.height
//     camera.updateProjectionMatrix()
//     renderer.setSize(sizes.width, sizes.height)
//     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
// })

/*
* maakt de camera aan met een standaarpositie
* controls maakt een orbital controler aan zodat je rond kan vliegen in de scene met behulp van import van three.js :)
*/
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2.5
scene.add(camera)
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.dampingFactor = 0.05

/*
* maakt de rendere aan die gebruikt maakt van webgl en zet antialiasing aan
*/
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias:true,
    precision:true
})


/*
* standaard audioplayer van three.js , je moet btw dubbel klikken voor de audio om te starten vanwege chrome policy
*de gecommente lijn is voor funny muziek
*/
camera.add( listener );
const sound = new THREE.Audio( listener );
const audiPlayer = new THREE.AudioLoader();
// audiPlayer.load( 'Music/Imperial.mp3', function( buffer ) {
audiPlayer.load( 'Music/pxiabay.mp3', function( buffer ) {
	sound.setLoop(true);
    sound.setBuffer(buffer)
	sound.setVolume(0.2);
	sound.play();
});

/*
* let mousex zorgt dat je met je muis de galaxy particles kan bewegen
*/
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(new THREE.Color('#000000'),1)
document.addEventListener('mousemove', animteGalaxy)
let mouseY = 0
let mouseX = 0

function animteGalaxy(event){
    mouseX = event.clientX
    mouseY = event.clientY
}

/*
* tick heeft de functie om altijd te blijven refreshen
* hierin bevinden zich de planeet rotaties omdat dit altijd geupdate moet worden
*/
const clock = new THREE.Clock()
const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    Sun.rotation.z = .2 * elapsedTime
    Sun2.rotation.y = .2 * elapsedTime
    Earth.rotation.x = 0.5 * elapsedTime
    Moon.rotation.x = 1 * elapsedTime
    Jupiter.rotation.y = -0.2 * elapsedTime
    Mars.rotation.y = 1 * elapsedTime
    saturnRing.rotation.z = 2 * elapsedTime
    galaxyMesh.rotation.x =  mouseX * (elapsedTime * 0.00004)
    galaxyMesh2.rotation.z = 0.1  * elapsedTime
    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}
tick()