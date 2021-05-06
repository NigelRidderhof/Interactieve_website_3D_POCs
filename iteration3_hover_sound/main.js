import * as THREE from '../modules/three.module.js';
import { OrbitControls } from '../modules/OrbitControls.js';
import { GLTFLoader } from '../modules/GLTFLoader.js';

let container, scene, camera, renderer, controls, loader, raycaster, intersected;

const pointer = new THREE.Vector2();

let sound;
var context = new AudioContext();


init();
animate();

function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x0f1011 );

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.set(-30, 0, 75);

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.enablePan = false;
    controls.maxPolarAngle = Math.PI /1.6;
    controls.enableDamping = true;
    controls.maxDistance = 200;
    controls.rotateSpeed = 0.8;

    const light = new THREE.PointLight( 0xffffff, 1.8, 200 );
    light.position.set( 0, 0, 50 );
    scene.add( light );

    loader = new GLTFLoader();
    loader.load('../assets/RAF_Baked.glb', function(gltf){
        gltf.scene.scale.set(0.2, 0.2, 0.2);
        gltf.scene.position.set(0,-25, 0);
        scene.add(gltf.scene);
    });

    const geometry = new THREE.CircleGeometry( 0.8, 32 );
    const object = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { color: 0xff0000, side: THREE.DoubleSide } ) );
    object.position.set(-31.0, -3.7, 9.5);
    scene.add( object );

    raycaster = new THREE.Raycaster();

    const listener = new THREE.AudioListener();
    camera.add( listener );
    sound = new THREE.Audio( listener );

    const audioLoader = new THREE.AudioLoader();
    audioLoader.load( '../assets/phone.ogg', function( buffer ) {
        sound.setBuffer( buffer );
        sound.setVolume( 0.5 );
        // sound.play();
    });

    document.addEventListener( 'mousemove', onPointerMove );

    window.addEventListener( 'resize', onWindowResize );
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function onPointerMove( event ) {
    pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

function animate() {
    requestAnimationFrame( animate );
    render();
}

function render() {
    camera.lookAt( scene.position );
    camera.updateMatrixWorld();

    raycaster.setFromCamera( pointer, camera );
    const intersects = raycaster.intersectObjects( scene.children );

    if ( intersects.length > 0 ) {
        console.log(intersects[ 0 ].object);
        if ( intersected != intersects[ 0 ].object ) {
            intersected = intersects[ 0 ].object;
            intersected.material.transparent = true;
            intersected.material.opacity = 0.3;
            
            context.resume().then(() => {
                console.log('Playback resumed successfully');
            });
            sound.isPlaying = false;
            sound.play();
        }
    } else {
        if ( intersected ) intersected.material.opacity = 1;
        intersected = null;
    }
    controls.update();

    renderer.render( scene, camera );
}