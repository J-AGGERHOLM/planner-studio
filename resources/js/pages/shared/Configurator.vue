<template></template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { UltraHDRLoader } from 'three/addons/loaders/UltraHDRLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
);

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
document.body.appendChild(renderer.domElement);

/* Light Settings */

const hdrLoader = new UltraHDRLoader();
const texture = await hdrLoader.loadAsync('textures/empty_play_room_1k.jpg');
texture.mapping = THREE.EquirectangularReflectionMapping;
scene.environment = texture;

const spotLight = new THREE.SpotLight();

spotLight.color.set(0xffffff);
spotLight.intensity = 20;
spotLight.distance = 10;
spotLight.penumbra = 1;

spotLight.position.set(0, 5, 2);
spotLight.castShadow = true;

spotLight.shadow.mapSize.set(1024, 1024);
spotLight.shadow.radius = 5;

scene.add(spotLight);

/* controls: */
const controls = new OrbitControls(camera, renderer.domElement);

controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.target.set(0, 0.5, 0);

/* floor plane: */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(30, 20),
    new THREE.ShadowMaterial({
        color: 0x000000,
        opacity: 0.25,
    }),
);

floor.rotation.x = -Math.PI / 2;
floor.position.y = -0;
floor.receiveShadow = true;

scene.add(floor);

const loader = new GLTFLoader();
const modelGlb = await loader.loadAsync('/models/hallingdal-547.glb');
const model = modelGlb.scene;
model.traverse((child) => {
    if (child instanceof THREE.Mesh) {
        child.castShadow = true;
    }
});

scene.add(model);

camera.position.z = 1.5;
camera.position.y = 0.75;
camera.rotation.x = -0.5;

function animate(time) {
    model.rotation.y = time / 5000;
    controls.update();
    renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
</script>
