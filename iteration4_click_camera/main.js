import * as THREE from '../modules/three.module.js';
import { OrbitControls } from '../modules/OrbitControls.js';
import { GLTFLoader } from '../modules/GLTFLoader.js';

let container, scene, camera, cameraStartPosition, renderer, controls, loader, raycaster, hoveredItem, clickedItem, sound, sound2;

const pointer = new THREE.Vector2();

init();
animate();

function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x222222 );

    const ringGeo = new THREE.RingGeometry( 2, 2.3, 32 );
    const ringMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, opacity: 0.8, transparent: true } );
    const ring = new THREE.Mesh( ringGeo, ringMaterial );
    ring.position.set( -31.5, -2.1, 9.5 );
    const areaRingGeo = new THREE.CircleGeometry( 2.4, 32 );
    const areaRingMaterial = new THREE.MeshBasicMaterial( { color: 0xffff00, opacity: 0, transparent: true } );
    const areaRing = new THREE.Mesh( areaRingGeo, areaRingMaterial );
    areaRing.position.set( -31.5, -2.1, 9.6 );

    const ringGeo2 = new THREE.RingGeometry( 3.4, 3.8, 32 );
    const ringMaterial2 = new THREE.MeshBasicMaterial( { color: 0xff0000, opacity: 0.8, transparent: true } );
    const ring2 = new THREE.Mesh( ringGeo2, ringMaterial2 );
    ring2.position.set( 37.0, 0.2, 9.5 );
    const areaRingGeo2 = new THREE.CircleGeometry( 3.9, 32 );
    const areaRingMaterial2 = new THREE.MeshBasicMaterial( { color: 0xffff00, opacity: 0, transparent: true } );
    const areaRing2 = new THREE.Mesh( areaRingGeo2, areaRingMaterial2 );
    areaRing2.position.set( 37.0, 0.2, 9.6 );

    scene.add( ring, areaRing, ring2, areaRing2);

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.set(-30, 0, 75);
    cameraStartPosition = { x: -30, y: 0, z: 75 };
    camera.lookAt( scene.position );

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    controls = new OrbitControls( camera, renderer.domElement );
    controls.target.set( 0, 0, 0 );
    controls.enablePan = false;
    controls.maxPolarAngle = Math.PI / 1.7;
    controls.enableDamping = true;
    controls.maxDistance = 200;
    controls.rotateSpeed = 0.8;

    const light = new THREE.PointLight( 0xffffff, 1.8, 200 );
    light.position.set( 0, 0, 50 );
    const light2 = new THREE.PointLight( 0xffffff, 1.3, 150 );
    light2.position.set( 0, 0, -40 );
    const light3 = new THREE.PointLight( 0xffffff, 1.8, 100 );
    light3.position.set( 100, 0, 30 );
    const light4 = new THREE.PointLight( 0xffffff, 1.8, 100 );
    light4.position.set( -100, 0, 30 );
    scene.add( light, light2, light3, light4 );

    loader = new GLTFLoader();
    loader.load( '../assets/RAF_Baked.glb', function( gltf ){
        gltf.scene.scale.set( 0.2, 0.2, 0.2 );
        gltf.scene.position.set( 0, -25, 0 );
        scene.add( gltf.scene );
    });

    raycaster = new THREE.Raycaster();

    const listener = new THREE.AudioListener();
    camera.add( listener );
    sound = new THREE.Audio( listener );
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load( '../assets/phone.ogg', function( buffer ) {
        sound.setBuffer( buffer );
        sound.setVolume( 0.5 );
    });
    sound2 = new THREE.Audio( listener );
    audioLoader.load( '../assets/planes.ogg', function( buffer ) {
        sound2.setBuffer( buffer );
        sound2.setVolume( 0.5 );
    });

    document.addEventListener( 'mousemove', onPointerMove );

    window.addEventListener( 'resize', onWindowResize );
    window.addEventListener( 'click', click );
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

function hover() {
    raycaster.setFromCamera( pointer, camera );
    const intersects = raycaster.intersectObjects( scene.children );

    if ( intersects.length > 0 ) {
        if ( hoveredItem != intersects[ 0 ].object ) {
            // hoveredItem = intersects[ 0 ].object;
            let ringId = intersects[ 0 ].object.id - 1;
            hoveredItem = scene.getObjectById( ringId, true );
            hoveredItem.material.transparent = true;
            hoveredItem.material.opacity = 0.3;
        }
    } else {
        if ( hoveredItem ) hoveredItem.material.opacity = 0.8;
        hoveredItem = null;
    }
}

function click() {
    raycaster.setFromCamera( pointer, camera );
    const intersects = raycaster.intersectObjects( scene.children );
    if ( intersects.length > 0 ) {
        clickedItem = intersects[ 0 ].object;
        controls.enabled = false;

        if ( clickedItem.id == 7 ) {
            sound.isPlaying = false;
            setTimeout(function(){ sound.play(); }, 1000);
            createjs.Tween.get( camera.position ).to( { y: 0, x: -25, z: 25 }, 2000, createjs.Ease.getPowInOut( 5 ) ).wait( 1000 ).to( cameraStartPosition, 2000, createjs.Ease.getPowInOut( 5 ) ).call( function() {controls.enabled = true} ) ;
            createjs.Tween.get( controls.target ).to( { x: -35 }, 2000, createjs.Ease.getPowInOut(5) ).wait(1000).to( { x: 0 }, 2000, createjs.Ease.getPowInOut(5) );
        } else {
            sound2.isPlaying = false;
            setTimeout(function(){ sound2.play(); }, 1000);
            createjs.Tween.get( camera.position ).to( { y: -5, x: 25, z: 30 }, 2000, createjs.Ease.getPowInOut(5) ).wait( 2100 ).to( cameraStartPosition, 2000, createjs.Ease.getPowInOut( 5 ) ).call( function() {controls.enabled = true} ) ;
            createjs.Tween.get( controls.target ).to( { x: 35 }, 2000, createjs.Ease.getPowInOut( 5 ) ).wait( 2100 ).to( { x: 0 }, 2000, createjs.Ease.getPowInOut( 5 ) );
        }
    }
}

function animate() {
    requestAnimationFrame( animate );
    camera.updateMatrixWorld();
    hover();
    controls.update();
    renderer.render( scene, camera );
}