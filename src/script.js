import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as dat from 'dat.gui'
import { BasicShadowMap, Group, Vector3, WireframeGeometry } from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';

let camera,container,scene,renderer,overlay
let max = 30;
let min = 2.5;
let scalerMax = 5
let scalerMin = 0.5

const startButton = document.getElementById( 'startButton' );
startButton.addEventListener( 'click', main );

function main(){

overlay = document.getElementById( 'overlay' );
overlay.remove();

container = document.getElementById( 'container' );
renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( 0xffffff );
renderer.setPixelRatio( window.devicePixelRatio );
container.appendChild( renderer.domElement );

//weet niet welke cooler is rgbd of srgb
renderer.outputEncoding = THREE.RGBDEncoding;

//afbeelding textures en texture lader
const textureLoader = new THREE.TextureLoader()
const sunNormal = textureLoader.load('/Textures/2k_sun.jpg')
const earthNormal = textureLoader.load('/Textures/NormalMapEarthNight.png')
const cross = textureLoader.load('/Textures/cross.png')
const jupNormal = textureLoader.load('/Textures/NormalMapJupiter.png')
const marsNormal = textureLoader.load('/Textures/NormalMapMars.png')
const moonNormal = textureLoader.load('/Textures/NormalMap.png')

// Canvas
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
scene = new THREE.Scene();
{
//   const color = 0xbea7b2;  
//   const near = 5;
//   const far = 80;
//   scene.fog = new THREE.Fog(color, near, far);
}

//maakt galaxy aan
const galaxySun = new THREE.PointsMaterial({
    size:0.005,
})
const galaxymat = new THREE.PointsMaterial({
    size:0.7,
    map:cross,
    transparent:true,
    color: 'cyan',
})
const galaxymat2 = new THREE.PointsMaterial({
    size:0.5,
    map:cross,
    transparent:true,
    color: 'violet',
})
const galaxymat3 = new THREE.PointsMaterial({
    size:0.01,
    transparent:false,
    color: 'grey',
})



//galaxy background 1
const galaxyGeo = new THREE.SphereBufferGeometry(20,64,32)
const galaxyParticles = new THREE.BufferGeometry;
const galaxyMesh = new THREE.Points(galaxyParticles,galaxymat)
const particlesCount = 50000;
const posArray = new Float32Array(particlesCount * 3);
for(let i = 0; i<particlesCount *3; i++){
    posArray[i] = (Math.random() - 0.5) * (Math.random() * 100)
}
galaxyParticles.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
const galaxy = new THREE.Points(galaxyGeo,galaxySun)

//galaxy background 2
const posArray2 = new Float32Array(particlesCount * 3);
for(let i = 0; i<particlesCount *3; i++){
    posArray2[i] = (Math.random() - 0.5) * (Math.random() * 100)
}
const galaxyGeo2 = new THREE.SphereBufferGeometry(200,64,32)
const galaxyParticles2 = new THREE.BufferGeometry;
const galaxyMesh2 = new THREE.Points(galaxyParticles2,galaxymat2)
galaxyParticles2.setAttribute('position', new THREE.BufferAttribute(posArray2, 3))
const galaxy2 = new THREE.Points(galaxyGeo2,galaxySun)

/*elke planeet heeft een ...Geo dus geometry met positie en de hoeken van de cirkel
* daarnaast hebben ze een mesh ofterwel een mat(eriaal) met de kleur en eigenschappen maar die heb ik eronder gezet
* tot slot komt het samen tot de planeetmesh waarin dus bovenstaande eigenschappen worden meegegeven
* en zon 1 en 2 hebben een emmisive map en emmision als eigenschap zodat het lijkt alsof het een zon is/ meer gloeit
* en zon 2 heeft identieke eigenschappen en dezelfde locatie zodat de 2 spheres door elkaar heen clippen wat er best wel cool uitziet
*/
//Zonnen




const material = new THREE.MeshStandardMaterial({color : 0xff5349})
const geometry = new THREE.SphereBufferGeometry(.5,32,32)

const Sun = new THREE.Mesh(geometry,material)
material.roughness = 1,material.metalness = 0.5,material.normalMap = sunNormal;
material.emissive = new THREE.Color(1, 0, 0),material.emissiveIntensity = 1;
geometry.createEmissiveMap = createEmissiveMap()
const Sun2 = new THREE.Mesh(geometry,material)

const son = new THREE.Group(geometry,material);
son.position.y=4
son.add(Sun);
son.add(Sun2);
scene.add(son);

//pink sun
const planDist = 6
const planets = new THREE.Group();

const geometry1 = new THREE.SphereBufferGeometry(1,32,32)
const material1 = new THREE.MeshStandardMaterial({color : 0xFF69B4})
const Pink = new THREE.Mesh(geometry1,material1)
material1.roughness = 1,material1.metalness = 0.5,material1.normalMap = sunNormal;
material1.emissive = new THREE.Color(1, 105/255, 180/255),material1.emissiveIntensity = 1,material1.createEmissiveMap = createEmissiveMap()
Pink.position.set(-3,4,20)
planets.add(Pink);

    
    var rngPosX;
    var rngPosY;
    
    var scaler;
function randomPos(){
    const planetCount = 30;
    for(let i = 0; i < planetCount; i++){
        rngPosX = Math.floor(Math.random() * (max - min + 1)) + min;
        rngPosY = Math.floor(Math.random() * (max - min + 1)) + min;
        scaler = Math.floor(Math.random() * (scalerMax - scalerMin + 1)) + scalerMin;

        const planetMat = new THREE.MeshPhysicalMaterial({
            color: 0x49ef4,
            metalness: 0.9,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1,
            roughness: 0.5,
            normalMap:marsNormal
        })
        const planetGeo = new THREE.SphereBufferGeometry(scaler,32,32)
        const planet = new THREE.Mesh(planetGeo,planetMat)
        planet.position.set(-rngPosX,rngPosY,rngPosX+planDist)
        const planeten = new THREE.Group(planetGeo,planetMat);
        planeten.add(planet)  
        scene.add(planeten)  
    }
} randomPos()


function randomLight(){
    const planetCount = 10;
    for(let i = 0; i < planetCount; i++){
        rngPosX = Math.floor(Math.random() * (max - min + 2)) + min;
        rngPosY = Math.floor(Math.random() * (max - min -2)) + min;
        scaler = Math.floor(Math.random() * (scalerMax - scalerMin + 1)) + scalerMin;

    const planetMat1 = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.9,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        roughness: 0.5,
        normalMap:marsNormal,
        emissive: new THREE.Color(1,0,0),
        emissiveIntensity:10,      
    })
    const planetGeo1 = new THREE.SphereBufferGeometry(scaler,32,32)
    const planet1 = new THREE.Mesh(planetGeo1,planetMat1)
    const planeten1 = new THREE.Group(planetGeo1,planetMat1);
    planeten1.add(planet1)      
    planet1.position.set(rngPosX,rngPosY,planDist*rngPosX)
    scene.add(planeten1)  
    }
}randomLight()

const earthGeo = new THREE.SphereBufferGeometry(1,32,32)
    const earthMat = new THREE.MeshToonMaterial({color : 0x49ef4})
    const Earth = new THREE.Mesh(earthGeo,earthMat)
    Earth.position.set(rngPosX,rngPosY,15)
    earthMat.normalMap = earthNormal;
  

//Planeet 2
const moonGeo = new THREE.SphereBufferGeometry(.2,32,32)
const moonMat = new THREE.MeshStandardMaterial({color : 'grey'})
const Moon = new THREE.Mesh(moonGeo,moonMat)
Moon.position.x = 0.2,Moon.position.y = 0.2,Moon.position.z = planDist
moonMat.normalMap = moonNormal;
planets.add(Moon);

//Mars
const marsGeo = new THREE.SphereBufferGeometry(.4,32,32)
const marsMat = new THREE.MeshStandardMaterial({color : 0xbea7b2})
const Mars = new THREE.Mesh(marsGeo,marsMat)
Mars.position.x = -4,Mars.position.y = 4
marsMat.normalMap = marsNormal;
planets.add(Mars);

//Jupiter
const jupiterGeo = new THREE.SphereBufferGeometry(4,32,32)
const jupiterMat = new THREE.MeshStandardMaterial({color : 'brown'})
const Jupiter = new THREE.Mesh(jupiterGeo,jupiterMat)
Jupiter.position.x = 6.5,Jupiter.position.y = -6.5,jupiterMat.normalMap = jupNormal;
planets.add(Jupiter);


const planetWithRingGeo = new THREE.SphereBufferGeometry(1.5,32,32)
const planetWithRingMat = new THREE.MeshStandardMaterial({color : 'hotpink'})
const PlanetWithRing = new THREE.Mesh(planetWithRingGeo,planetWithRingMat)
PlanetWithRing.position.set(-2,-4,planDist)
const ringGeo = new THREE.SphereGeometry( 1.6,64,32,0,.04,0,10 );
const ringMat = new THREE.MeshBasicMaterial( { color: 0xffffff} );
const planetRing = new THREE.Mesh( ringGeo, ringMat );

const planetsWithRing = new THREE.Group()
planetsWithRing.add(PlanetWithRing,planetRing)
scene.add(planetsWithRing)

//dit is voor camera dingen maar moet vervangen woorden door een dragcamera
const vec3 = new Vector3(0,0,0)

//inladen van objecten
const sideObj = new THREE.Group()
const firstPersonObj = new THREE.Group()
    const gltfLoader = new GLTFLoader();
    const url = 'Objects/scene.gltf';      
    gltfLoader.load(url, (gltf) => {
      const root = gltf.scene;
      root.scale.multiplyScalar(1/20) 
      root.position.set(0,1.5,-10)
      root.rotateY(1.55)
      root.receiveShadow = true;
      firstPersonObj.add(root)
      camera.lookAt(vec3)

      root.add(camera)
});

//aaaah
//dit moet ik nog effe net als de random planeten in een ding zetten enzo 
//dan kan ik 10 ervan neerzeteen en dat is wel cool

const gltfLoader2 = new GLTFLoader();
const url2 = 'Objects/scene.gltf';      
gltfLoader2.load(url2, (gltf2) => {
    const root2 = gltf2.scene;
    root2.scale.multiplyScalar(1/16) 
    root2.position.set(-1,2,-10)
    root2.rotateY(1.75)
    sideObj.add(root2)
  });


const gltfLoader3 = new GLTFLoader();
const url3 = 'Objects/scene.gltf';      
gltfLoader3.load(url3, (gltf3) => {
    const root3 = gltf3.scene;
    root3.scale.multiplyScalar(1/4) 
    root3.position.set(2,2,-10)
    root3.rotateY(1.75)
    sideObj.add(root3)
});

//onderstaande voegt alle objecten toe aan de scene
//son.add voegt dingen aan de groep toe zodat ik ze als geheel kan laten draaien
son.add(Jupiter)
son.add(Mars)
son.add(planetsWithRing)
scene.add(galaxy,galaxyMesh)
scene.add(galaxy2,galaxyMesh2)
scene.add(son)
scene.add(sideObj)
scene.add(firstPersonObj)


//maakt de lichten aan met kleur en afstand zodat het er mooi uitziet
//de pointlighthelper zijn in principe om te debuggen maar ik vind het wel mooi eruit zien dus heb ik het erin gelaten
const pointLight = new THREE.PointLight(0xff0000, 10,500,10)
pointLight.position.set(0,-5,0,1)
const pointLight2 = new THREE.PointLight(0xffa500, 10,500,5)
pointLight2.position.set(0,4,0,1.5)
const pointLight3 = new THREE.PointLight(0xffffff, 1,521,7)
pointLight3.position.set(0,10,0,1.5)

//zet 1 naar 100 waneer we first person gaan
const pinkLight = new THREE.PointLight(0xFF69B4,100,500,20)
pinkLight.position.set(0,0,0)
Pink.add(pinkLight)
const epic = new THREE.Group(geometry1,material1,pinkLight);
epic.add(Pink)
epic.clone(Pink)
scene.add(epic)

const pojntlighthelper = new THREE.PointLightHelper(pointLight2, 1)
const lights = new THREE.Group()
lights.add(pojntlighthelper)
lights.add(pointLight)
lights.add(pointLight2)
lights.add(pointLight3)
scene.add(lights)

//maakt het formaat van het canvas ik weet alleen niet hoe je het moet resizen
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/*
* maakt de camera aan met een standaarpositie
* controls maakt een orbital controler aan zodat je rond kan vliegen in de scene met behulp van import van three.js :)
*/
camera = new THREE.PerspectiveCamera(100, sizes.width / sizes.height, 0.1, 200)
camera.position.x = 11.5,camera.position.y = 2,camera.position.z = 0.5

// const controls = new OrbitControls(camera, container)
// controls.enableDamping = true
// controls.dampingFactor = 0.05

//standaard audioplayer van three.js , je moet btw spam klikken voor de audio om te starten vanwege chrome policy
const listener = new THREE.AudioListener();
camera.add( listener );
const sound = new THREE.Audio( listener );
const audiPlayer = new THREE.AudioLoader();
audiPlayer.load( 'Music/cosmic.mp3', function( buffer ) {
	sound.setLoop(true);
    sound.setBuffer(buffer)
	sound.setVolume(0.05);
	sound.play();
});

//let mousex zorgt dat je met je muis de galaxy particles kan bewegen
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
* dit stats is voor de fps counter
*/
const stats = Stats()
document.body.appendChild(stats.dom)
const clock = new THREE.Clock()
function tick()
    {
        const elapsedTime = clock.getElapsedTime()
        son.rotation.z = .2* elapsedTime
        galaxyMesh.rotation.y =  elapsedTime * 0.000004
        galaxyMesh2.rotation.z = .000002  * elapsedTime
        Earth.rotation.z = .4*elapsedTime
        camera.rotation.y = mouseY * 0.002  
        camera.rotation.x = mouseX * -0.002  
        // firstPersonObj.translateZ(0.000002*mouseY);
        firstPersonObj.translateZ(0.002);
        sideObj.translateZ(0.002);

        // controls.update()

        renderer.render(scene, camera)
        stats.update()
        window.requestAnimationFrame(tick)
    }tick()
}
//470 lines nu 414 dus beetje winst zonder de .obj dingen te doen, nice