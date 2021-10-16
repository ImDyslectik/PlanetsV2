import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as dat from 'dat.gui'
import { BasicShadowMap, Group, WireframeGeometry } from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';




let camera,canvas,scene,renderer


const startButton = document.getElementById( 'startButton' );
			startButton.addEventListener( 'click', main );



function main(){

    const overlay = document.getElementById( 'overlay' );
				overlay.remove();

    const container = document.getElementById( 'container' );
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setClearColor( 0x000000 );
	renderer.setPixelRatio( window.devicePixelRatio );
	container.appendChild( renderer.domElement );


    


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
const particlesCount = 200000;
const posArray = new Float32Array(particlesCount * 3);
for(let i = 0; i<particlesCount *3; i++){
    posArray[i] = (Math.random() - 0.5) * (Math.random() * 100)
}
galaxyParticles.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
const galaxy = new THREE.Points(galaxyGeo,galaxySun)

//galaxy background 2
const galaxyGeo2 = new THREE.SphereBufferGeometry(200,64,32)
const galaxyParticles2 = new THREE.BufferGeometry;
const galaxyMesh2 = new THREE.Points(galaxyParticles2,galaxymat2)
galaxyParticles2.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
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
son.add(Sun);
son.add(Sun2);
scene.add(son);

//pink sun
const planDist = 6

const geometry1 = new THREE.SphereBufferGeometry(1,32,32)
const material1 = new THREE.MeshStandardMaterial({color : 0xFF69B4})
const Pink = new THREE.Mesh(geometry1,material1)
material1.roughness = 1,material1.metalness = 0.5,material1.normalMap = sunNormal;
material1.emissive = new THREE.Color(1, 105/255, 180/255),material1.emissiveIntensity = 1,material1.createEmissiveMap = createEmissiveMap()
Pink.position.z=planDist+planDist,Pink.position.y=1;

//Planeet 2
const moonGeo = new THREE.SphereBufferGeometry(.2,32,32)
const moonMat = new THREE.MeshStandardMaterial({color : 'grey'})
const Moon = new THREE.Mesh(moonGeo,moonMat)
Moon.position.x = 0.2,Moon.position.y = 0.2,Moon.position.z = planDist
moonMat.normalMap = moonNormal;

//Mars
const marsGeo = new THREE.SphereBufferGeometry(.4,32,32)
const marsMat = new THREE.MeshStandardMaterial({color : 0xbea7b2})
const Mars = new THREE.Mesh(marsGeo,marsMat)
Mars.position.x = -4,Mars.position.y = 4
marsMat.normalMap = marsNormal;

//Jupiter
const jupiterGeo = new THREE.SphereBufferGeometry(4,32,32)
const jupiterMat = new THREE.MeshStandardMaterial({color : 'brown'})
const Jupiter = new THREE.Mesh(jupiterGeo,jupiterMat)
Jupiter.position.x = 6.5,Jupiter.position.y = -6.5,jupiterMat.normalMap = jupNormal;



const planetWithRingGeo = new THREE.SphereBufferGeometry(1.5,32,32)
const planetWithRingMat = new THREE.MeshStandardMaterial({color : 'hotpink'})
const PlanetWithRing = new THREE.Mesh(planetWithRingGeo,planetWithRingMat)
PlanetWithRing.position.set(-2,-4,planDist)
planetWithRingMat.roughness = 1,planetWithRingMat.metalness = 1;
const ringGeo = new THREE.SphereGeometry( 1.6,64,32,0,.04,0,10 );
const ringMat = new THREE.MeshBasicMaterial( { color: 0xffffff} );
const planetRing = new THREE.Mesh( ringGeo, ringMat );

const planetsWithRing = new THREE.Group()
var newPlanet = PlanetWithRing.clone();
newPlanet.position.set(-4,-2,planDist)


var newRing = planetRing.clone();
newRing.position.set(newPlanet)

planetsWithRing.add(newPlanet)
planetsWithRing.add(PlanetWithRing)
scene.add(planetsWithRing)


//inladen van objecten
const sideObj = new THREE.Group()
const firstPersonObj = new THREE.Group()
    const gltfLoader = new GLTFLoader();
    const url = 'Objects/scene.gltf';      
    gltfLoader.load(url, (gltf) => {
      const root = gltf.scene;
      root.scale.multiplyScalar(1/20) 
      root.position.set(0,-0.7,-3)
      root.rotateY(1.55)
      root.receiveShadow = true;
      firstPersonObj.add(root)
      camera.lookAt(root.position,galaxy,galaxyMesh)
      root.add(camera)
    });


const gltfLoader2 = new GLTFLoader();
const url2 = 'Objects/scene.gltf';      
gltfLoader2.load(url2, (gltf2) => {
    const root2 = gltf2.scene;
    root2.scale.multiplyScalar(1/16) 
    root2.position.set(-1,-0.5,-3)
    root2.rotateY(1.75)
    sideObj.add(root2)
  });


const gltfLoader3 = new GLTFLoader();
const url3 = 'Objects/scene.gltf';      
gltfLoader3.load(url3, (gltf3) => {
    const root3 = gltf3.scene;
    root3.scale.multiplyScalar(1/4) 
    root3.position.set(2,-0.5,-2)
    root3.rotateY(1.75)
    sideObj.add(root3)
  });

/*onderstaande voegt alle objecten toe aan de scene
*sun.add voegt dingen aan de zon toe zodat ze rond draaien
*#planeetnaam.add(#andereplaneet) voegt objecten aan planeten toe zodat er om de planeten ook een planeet kan draaien, BTW leuk ding, als je een beroerte wilt krijgen voeg galaxy toe aan groep son
*/
scene.add(galaxy,galaxyMesh)
scene.add(galaxy2,galaxyMesh2)
scene.add(son)
scene.add(sideObj)
scene.add(firstPersonObj)
son.add(Jupiter)
son.add(Mars)
son.add(planetsWithRing)


/*maakt de lichten aan met kleur en afstand zodat het er mooi uitziet
* de pointlighthelper zijn in principe om te debuggen maar ik vind het wel mooi eruit zien dus heb ik het erin gelaten
* scene.add voegt hier de lichten toe
*/
const pointLight = new THREE.PointLight(0xff0000, 1,10)
pointLight.position.set(0,-5,0,1)
const pointLight2 = new THREE.PointLight(0xffa500, 10,50)
pointLight2.position.set(0,0,0,1.5)
pointLight2.intensity = 1;
pointLight2.distance = 1000;
const pointLight3 = new THREE.PointLight(0xffffff, 1,21)
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
scene.add(pojntlighthelper)
scene.add(pointLight)
scene.add(pointLight2)
scene.add(pointLight3)

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


camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 200)
camera.position.x = 11.5,camera.position.y = 2,camera.position.z = 0.5

// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true
// controls.dampingFactor = 0.05



/*
* maakt de rendere aan die gebruikt maakt van webgl en zet antialiasing aan
*/



/*
* standaard audioplayer van three.js , je moet btw spam klikken voor de audio om te starten vanwege chrome policy
*/
const listener = new THREE.AudioListener();
camera.add( listener );
const sound = new THREE.Audio( listener );
const audiPlayer = new THREE.AudioLoader();
audiPlayer.load( 'Music/Imperial.mp3', function( buffer ) {
	sound.setLoop(true);
    sound.setBuffer(buffer)
	sound.setVolume(0.05);
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


// const domEvents = new THREE.domEvents(camera,renderer.domElement)
// domEvents.addEventListener(Earth,'click',event =>{
//     earthMat.wireframe = true;
// })

function animteGalaxy(event){
    mouseX = event.clientX
    mouseY = event.clientY
}


/*
* tick heeft de functie om altijd te blijven refreshen
* hierin bevinden zich de planeet rotaties omdat dit altijd geupdate moet worden
* dit stats is voor de fps counter
*/
const earthGeo = new THREE.SphereBufferGeometry(1,32,32)
    const earthMat = new THREE.MeshStandardMaterial({color : 0x49ef4})
    const Earth = new THREE.Mesh(earthGeo,earthMat)
    Earth.position.x = -1,Earth.position.y = 0,Earth.position.z = 6;
    earthMat.normalMap = earthNormal;
    const planeten = new THREE.Group(geometry,material);
    planeten.add(Earth)
    scene.add(planeten)



const stats = Stats()
document.body.appendChild(stats.dom)
const clock = new THREE.Clock()
function tick()
{
    const elapsedTime = clock.getElapsedTime()


        console.log('cum')


    const rot = .2    
    son.rotation.z = rot* elapsedTime
    Sun2.rotation.y = rot * elapsedTime
    Earth.rotation.x = rot * elapsedTime
    Moon.rotation.x = rot * elapsedTime
    planetRing.rotation.z = 2 * elapsedTime
    galaxyMesh.rotation.y =  mouseX * (elapsedTime * 0.000004)
    galaxyMesh2.rotation.z = rot  * elapsedTime
    Pink.rotation.z = rot * elapsedTime

    firstPersonObj.translateZ(0.000002*mouseY);
    firstPersonObj.translateZ(0.002);

    // controls.update()

    renderer.render(scene, camera)
    stats.update()
    window.requestAnimationFrame(tick)
}
tick()
}