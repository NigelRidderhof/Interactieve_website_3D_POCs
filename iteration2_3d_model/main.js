import * as THREE from '../modules/three.module.js';
import { OrbitControls } from '../modules/OrbitControls.js';
import { GLTFLoader } from '../modules/GLTFLoader.js';


var scene, camera, renderer, controls, mouse, raycaster;
let ringButton;
// let buttons;

function init() {

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    mouse = new THREE.Vector2();
    raycaster = new THREE.Raycaster();

    ringButton = new THREE.Group();
    ringButton.position.set(-31.5, -2.1, 9.5);

    const ringGeo = new THREE.RingGeometry( 2, 2.3, 32 );
    const ringMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, opacity: 0.8, transparent: true, side: THREE.DoubleSide } );
    const ring = new THREE.Mesh( ringGeo, ringMaterial );
    // ring.position.set(-31.5, -2.1, 9.5);
    ring.updateMatrixWorld();
    ring.geometry.verticesNeedUpdate = true;
    // scene.add(ring);

    // const ringGeo2 = new THREE.RingGeometry( 2, 2.3, 32 );
    // const ringMaterial2 = new THREE.MeshBasicMaterial( { color: 0xff0000, opacity: 0.8, transparent: true, side: THREE.DoubleSide } );
    // const ring2 = new THREE.Mesh( ringGeo2, ringMaterial2 );
    // ring2.position.set(-33.5, -2.1, 9.5);
    // ring2.updateMatrixWorld();
    // scene.add(ring2);
    
    const areaRingGeo = new THREE.RingGeometry( 3.5, 0, 32 );
    const areaRingMaterial = new THREE.MeshBasicMaterial( { color: 0xffff00, opacity: 0.8, transparent: true, side: THREE.DoubleSide } );
    const areaRing = new THREE.Mesh( areaRingGeo, areaRingMaterial );
    areaRing.position.z = 0.1;

    ringButton.add(ring);
    ringButton.add(areaRing);
    scene.add(ringButton);

    // buttons = [];
    // buttons.push(ring);
    // buttons.push(ring2);
    
    const loader = new GLTFLoader();
    loader.load('../assets/RAF_Baked.glb', function(gltf){
        gltf.scene.scale.set(0.2, 0.2, 0.2);
        gltf.scene.position.set(0,-25, 0);
        // console.log(gltf.scene.children);
        scene.add(gltf.scene);
    });

    const light = new THREE.PointLight(0xffffff, 1.8, 200);
    light.position.set(0, 0, 50);
    scene.add(light);
    // const pointLightHelper = new THREE.PointLightHelper(light, 20);
    // scene.add(pointLightHelper);

    camera.position.set(-30, 0, 75);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.enablePan = false;
    controls.maxPolarAngle = Math.PI /1.6;
    controls.enableDamping = true;

    window.requestAnimationFrame(animate);
}

function hover() {
    raycaster.setFromCamera(mouse, camera);
    console.log(ringButton);
    const intersects = raycaster.intersectObjects(ringButton, true);
    console.log(intersects);
    for (let i = 0; i < intersects.length; i++) {
        console.log("intersected");
        intersects[i].object.material.transparent = true;
        intersects[i].object.material.opacity = 0.1;
    }
}

function animate() {
    controls.update();
    hover();
    renderer.render(scene, camera);
    window.requestAnimationFrame(animate);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize);


function onMouseMove ( event ) {
    mouse.x = ( event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = (event.clientY / window.innerHeight) * 2 + 1;
}
window.addEventListener('mousemove', onMouseMove, false);

window.onload = init;