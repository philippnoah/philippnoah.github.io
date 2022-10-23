
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.145.0/build/three.module.js';
  
import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.145.0/examples/jsm/controls/OrbitControls.js';
import {GUI} from 'https://cdn.jsdelivr.net/npm/dat.gui@0.7.9/build/dat.gui.module.js';
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.145.0/examples/jsm/loaders/GLTFLoader.js";

const loader = new GLTFLoader()

const gui = new GUI()

// Get a reference to the container element that will hold our scene
const container = document.querySelector('#scene-container');

// create a Scene
const scene = new THREE.Scene();

// Set the background color
scene.background = new THREE.Color(0x000000);

// Create a camera
const fov = 35; // AKA Field of View
const aspect = container.clientWidth / container.clientHeight;
const near = 0.1; // the near clipping plane
const far = 100; // the far clipping plane

const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

// every object is initially created at ( 0, 0, 0 )
// move the camera back so we can view the scene
// camera.position.set(0, 10, 2);

//Create a sphere that cast shadows (but does not receive them)
// const sphereGeometry = new THREE.SphereGeometry( 7, 100, 100);
// const sphereMaterial = new THREE.MeshStandardMaterial( { color: 0x0ffff0 } );
// const sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
// sphere.castShadow = true; //default is false
// sphere.receiveShadow = false; //default
// scene.add( sphere );

let pointLight = new THREE.PointLight( 0xffffff, 20, 0 );
// pointLight.position.set(0,8,0);
// pointLight.castShadow = true; 
//Set up shadow properties for the light
// pointLight.shadow.mapSize.width = 512; // default
// pointLight.shadow.mapSize.height = 512; // default
// pointLight.shadow.camera.near = 0.5; // default
// pointLight.shadow.camera.far = 500; // default

// camera.add(pointLight);
camera.add(pointLight);
scene.add(camera)

const planeGeo = new THREE.PlaneGeometry( 5, 5);
const planeMat = new THREE.MeshStandardMaterial( {color: 0xf0f0f0, side: THREE.DoubleSide} );
const plane = new THREE.Mesh( planeGeo, planeMat );
plane.rotation.x += Math.PI/2
plane.position.y -= 2
plane.receiveShadow = true;
plane.castShadow = true;
scene.add( plane );

// const helper = new THREE.CameraHelper( pointLight.shadow.camera );
// scene.add( helper );

// create a geometry
const geometry = new THREE.BoxGeometry(2,2,2);

// create a default (white) Basic material
// const material = new THREE.MeshStandardMaterial();

// create a Mesh containing the geometry and material
// const cube = new THREE.Mesh(geometry, material);

let mixer;

// add the mesh to the scene
// scene.add(cube);
// const animationsFolder = gui.addFolder('Animations')
loader.load( './trooper.gltf', function ( gltf ) {

  // let textureLoader = new TextureLoader()
  // textureLoader.load('trooper.png', (texture) => {
  //   console.log(1, err);
  // })
  gltf.scene.position.x = 0
  gltf.scene.position.y = -2
  gltf.scene.position.z = 0
  gltf.scene.castShadow = true; //default is false


  camera.position.set(0, 200, 200);
  camera.lookAt(0,0,0)

  // Create an AnimationMixer, and get the list of AnimationClip instances
  mixer = new THREE.AnimationMixer( gltf.scene );

  const clips = gltf.animations;
  console.log(clips);

  // Play a specific animation
  const clip = THREE.AnimationClip.findByName( clips, 'mixamo.com' );
  const action = mixer.clipAction( clip );
  action.play();

  // Play all animations
  clips.forEach( function ( clip ) {
    mixer.clipAction( clip ).play();
  } );

  scene.add( gltf.scene );

    // function animate() {
    //   requestAnimationFrame( animate );
    //   renderer.render( scene, camera );
    // };
    // animate();
})

// scene.add( light );

// create the renderer
const renderer = new THREE.WebGLRenderer({ alpha: true });
// renderer.setClearColorHex( 0x000000, 1 );
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; 

const controls = new OrbitControls( camera, renderer.domElement );
controls.enableZoom = false;
controls.enableDamping = true;
controls.dampingFactor = 0.01
controls.maxDistance = 10
controls.minDistance = 7
controls.maxPolarAngle = 1.4
controls.minPolarAngle = 1.2


controls.update();

renderer.physicallyCorrectLights = true;

// next, set the renderer to the same size as our container element
renderer.setSize(container.clientWidth, container.clientHeight);

// finally, set the pixel ratio so that our scene will look good on HiDPI displays
renderer.setPixelRatio(window.devicePixelRatio);

// add the automatically created <canvas> element to the page
container.append(renderer.domElement);


// render, or 'create a still image', of the scene
renderer.render(scene, camera);
      var clock = new THREE.Clock();
      function animate() {
        if ( mixer ) mixer.update( clock.getDelta() );
				requestAnimationFrame( animate );
        controls.update();
				renderer.render( scene, camera );
			};
      animate();