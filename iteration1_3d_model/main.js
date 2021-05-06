let scene, camera, renderer, controls;

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xdddddd);

    camera = new THREE.PerspectiveCamera(40, window.innerWidth/window.innerHeight, 1, 5000);
    camera.rotation.y = 45/180*Math.PI;
    camera.position.x = 800;
    camera.position.y = 100;
    camera.position.z = 1000;

    let hLight = new THREE.AmbientLight(0x404040,100);
    scene.add(hLight);

    let directionalLight = new THREE.DirectionalLight(0xffffff, 100);
    directionalLight.position.set(0,1,0);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    let light = new THREE.PointLight(0xc4c4c4, 10);
    light.position.set(0,300,500);
    scene.add(light);

    renderer = new THREE.WebGL1Renderer({antialias:true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', renderer);

    let loader = new THREE.GLTFLoader();
    loader.load('../assets/RAF_Baked.glb', function(gltf){
        let wall = gltf.scene.children[0];
        wall.scale.set(0.5, 0.5, 0.5);
        scene.add(gltf.scene);
        // renderer.render(scene, camera);
        animate();
    });
}
function animate() {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

init();