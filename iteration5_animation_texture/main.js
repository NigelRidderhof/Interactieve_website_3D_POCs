import * as THREE from '../modules/three.module.js';
import { OrbitControls } from '../modules/OrbitControls.js';
import { GLTFLoader } from '../modules/GLTFLoader.js';

// Initialisatie globale variabelen.
let container, scene, camera, cameraStartPosition, renderer, controls, loader, raycaster, hoveredItem, clickedItemName, sound, sound2, buttons, clickPermission = true;
const pointer = new THREE.Vector2();

init();
animate();

function init() {
    // Toevoegen van een div aan de HTML body.
    container = document.createElement( 'div' );
    document.body.appendChild( container );

    // ThreeJS scene waaraan je de onderdelen toevoegt.
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x222222 );

    // Rode cirkels die gaan functioneren als knoppen. 
    const circle1 = new THREE.CircleGeometry( 0.9, 32 );
    const button1 = new THREE.Mesh( circle1, new THREE.MeshBasicMaterial( { color: 0xff0000, opacity: 0.9, transparent: true } ) );
    button1.position.set(-31.3, -3.7, 9.6);
    button1.userData.name = "buttonPhone";
    const circle2 = new THREE.CircleGeometry( 1.1, 32 );
    const button2 = new THREE.Mesh( circle2, new THREE.MeshBasicMaterial( { color: 0xff0000, opacity: 0.9, transparent: true } ) );
    button2.position.set(34.1, -1.7, 9.6);
    button2.userData.name = "buttonPlanes";
    scene.add( button1, button2 );
    buttons = [ button1, button2 ];

    // Camera instellingen.
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.set( -30, 0, 75 );
    cameraStartPosition = { x: -30, y: 0, z: 75 };      // Later nodig om de camera na een perspectiefverandering te resetten.
    camera.lookAt( scene.position );

    // Render instellingen zodat de scene met elementen (goed) laadt.
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement ); // Voegt de te renderen scene toe aan het div element.

    // De instellingen voor de manier waarop met de scene geïnteracteerd kan worden.
    controls = new OrbitControls( camera, renderer.domElement );
    controls.target.set( 0, 0, 0 );
    controls.enablePan = false;                 // Voorkomt dat de gebruiker zelf de scene kan verplaatsen en eventueel kwijt kan raken.
    controls.maxPolarAngle = Math.PI / 1.7;     // Stelt maximale hoek in waarop de scene gedraaid kan worden.
    controls.enableDamping = true;              // Maakt de draaiing minder responsive en daardoor smoother.
    controls.maxDistance = 200;                 // Maximale uitzoom.
    controls.rotateSpeed = 0.8;                 // Maximale snelheid waarop je de scene kunt draaien. 

    // Belichting.
    const light = new THREE.PointLight( 0xffffff, 1.8, 200 );
    light.position.set( 0, 0, 50 );
    const light2 = new THREE.PointLight( 0xffffff, 1.3, 150 );
    light2.position.set( 0, 0, -40 );
    const light3 = new THREE.PointLight( 0xffffff, 1.8, 100 );
    light3.position.set( 100, 0, 30 );
    const light4 = new THREE.PointLight( 0xffffff, 1.8, 100 );
    light4.position.set( -100, 0, 30 );
    scene.add( light, light2, light3, light4 );

    // Het inladen van het .glb bestand met de conductive wall.
    loader = new GLTFLoader();
    loader.load( '../assets/RAF_BakedWithoutProjection.glb', function( gltf ){
        gltf.scene.scale.set( 0.2, 0.2, 0.2 );
        gltf.scene.position.set( 0, -25, 0 );
        scene.add( gltf.scene );
    });

    // Raycaster nodig voor het latere registreren over welk 3D object gehoverd wordt. Hierbij wordt zogenaamd een ray/straal uit je cursor geschoten door de scene heen.
    raycaster = new THREE.Raycaster();

    // Audio instellingen voor het afspelen van geluidsbestanden. 
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

    // De projectie animatie middels een video texture op een plane. 
    const video = document.getElementById( 'video' );
    const texture = new THREE.VideoTexture( video );
    texture.format = THREE.RGBAFormat;
    let plane = new THREE.PlaneGeometry( 16, 9 );
    let projection = new THREE.Mesh( plane, new THREE.MeshBasicMaterial( { map: texture, transparent: true, opacity: 0.7 } ) );
    projection.position.set( -30.4, -1.8, 9.4 );
    projection.scale.set( 2.1, 2.1, 1 );
    scene.add( projection );

    document.addEventListener( 'mousemove', onPointerMove );

    window.addEventListener( 'resize', onWindowResize );
    window.addEventListener( 'click', click );
}

// Zorgt voor goede scaling bij het veranderen van de grootte van het venster.
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

// Zorgt voor bruikbare x en y coördinaten van de muis. 
function onPointerMove( event ) {
    pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

// Verhoogt de transparantie van een button wanneer je eroverheen hovert.
function hover() {
    raycaster.setFromCamera( pointer, camera );
    const intersects = raycaster.intersectObjects( buttons );   // De objecten binnen de array aan buttons die doorkruist worden door de ray van de raycaster.

    if ( intersects.length > 0 ) {
        if ( hoveredItem != intersects[ 0 ].object ) {
            hoveredItem = intersects[ 0 ].object;
            hoveredItem.material.transparent = true;
            hoveredItem.material.opacity = 0.3;
        }
    } else {
        if ( hoveredItem ) hoveredItem.material.opacity = 0.8;
        hoveredItem = null;
    }
}

// Start de animaties en audio die horen bij de button waarop geklikt wordt.
function click() {
    if ( clickPermission ) {    // De if-statement die voorkomt dat je tijdens de animatie en afspelende audio deze opnieuw kunt starten.
        clickPermission = false;
        
        raycaster.setFromCamera( pointer, camera );
        const intersects = raycaster.intersectObjects( buttons );
        if ( intersects.length > 0 ) {
            controls.enabled = false;       // Voorkomt dat je tijdens de animatie de scene kunt draaien gezien dit zorgt voor enorm snelle trillingen.
            
            clickedItemName = intersects[ 0 ].object.userData.name;
            if ( clickedItemName == "buttonPhone" ) {    // Wanneer geklikt wordt op de telefoon button...
                sound.isPlaying = false;
                setTimeout( () => { 
                    sound.play(); 
                }, 1000 );
                // Onderstaande 2 regels animeren de camera positie en perspectief naar de gewenste plek t.o.v. de muur.
                createjs.Tween.get( camera.position )
                    .to( { y: 0, x: -25, z: 25 }, 2000, createjs.Ease.getPowInOut( 5 ) )
                    .wait( 6500 )
                    .to( cameraStartPosition, 2000, createjs.Ease.getPowInOut( 5 ) )
                    .call( () => { 
                        controls.enabled = true; clickPermission = true; 
                    } );
                createjs.Tween.get( controls.target )
                    .to( { x: -35 }, 2000, createjs.Ease.getPowInOut( 5 ) )
                    .wait( 6500 )
                    .to( { x: 0 }, 2000, createjs.Ease.getPowInOut( 5 ) );
                video.play();   // Start de zogenaamde projectie animatie.
            } else if ( clickedItemName == "buttonPlanes" ) {     // Wanneer geklikt wordt op de vliegtuig button...
                sound2.isPlaying = false;
                setTimeout( () => { 
                    sound2.play();
                }, 1000 );
                createjs.Tween.get( camera.position )
                    .to( { y: -5, x: 25, z: 30 }, 2000, createjs.Ease.getPowInOut(5) )
                    .wait( 2100 )
                    .to( cameraStartPosition, 2000, createjs.Ease.getPowInOut( 5 ) )
                    .call( () => { 
                        controls.enabled = true; clickPermission = true; 
                    } );
                createjs.Tween.get( controls.target )
                    .to( { x: 35 }, 2000, createjs.Ease.getPowInOut( 5 ) )
                    .wait( 2100 )
                    .to( { x: 0 }, 2000, createjs.Ease.getPowInOut( 5 ) );
            } 
        } else { 
            clickPermission = true;
        }
    }
}

// De animate functie die ook vaak de render functie genoemd wordt en constant loopt en de nodige verversingen uitvoert.
function animate() {
    requestAnimationFrame( animate );
    camera.updateMatrixWorld();
    hover();
    controls.update();
    renderer.render( scene, camera );
}