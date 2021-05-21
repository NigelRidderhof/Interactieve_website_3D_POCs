// Back-up file for main.js before attempt to add interactivity.

import * as THREE from './three.module.js';
import { OrbitControls } from './OrbitControls.js';
import { GLTFLoader } from './GLTFLoader.js';


var scene, camera, renderer, controls;

function init() {

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const loader = new GLTFLoader();
    loader.load('./RAF_Baked.glb', function(gltf){
        gltf.scene.scale.set(0.2, 0.2, 0.2);
        gltf.scene.position.set(0,-25, 0);
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

function animate() {
    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(animate);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize);

window.onload = init;