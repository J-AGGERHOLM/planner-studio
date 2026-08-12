<template></template>

<script>
import * as THREE from 'three';
/* import { OrbitControls } from 'jsm/controls/OrbitControls.js';
 */ import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
/* import { UltraHDRLoader } from 'jsm/loaders/UltraHDRLoader.js';
 */
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

/* Light Settings */

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 2);
scene.add(hemiLight);

const sunlight = new THREE.DirectionalLight(0xffffff, 1);
sunlight.position.set(0, 0, 1);
scene.add(sunlight);

/* const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping.true; */

const loader = new GLTFLoader();
const modelGlb = await loader.loadAsync('/models/hallingdal-547.glb');
const model = modelGlb.scene;

model.traverse((child) => {
    if (child.isMesh) {
        child.geometry.center();
    }
});
scene.add(model);

camera.position.z = 1.5;
camera.position.y = 0.75;
camera.rotation.x = -0.5;

function animate(time) {
    model.rotation.y = time / 5000;
    renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
</script>
