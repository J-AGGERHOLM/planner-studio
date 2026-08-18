<template>
    <canvas ref="canvas" class="absolute -z-10 m-0 h-full w-full p-0"></canvas>

    <button class="bg-red absolute top-15 right-8" @click="loadModel">
        Press me!
    </button>
</template>

<script setup>
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { UltraHDRLoader } from 'three/addons/loaders/UltraHDRLoader.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { onMounted, ref } from 'vue';
import { getFirstObjectWithName } from '../../util/RayCastHelper.js';

/* Base scene set-up */

const canvas = ref(null);
let scene;
let camera;
let loader;
let renderer;

let activeObject;
let activeEntry;

const bBoxArray = [];

onMounted(async () => {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
        25,
        window.innerWidth / window.innerHeight,
        0.1,
        1000,
    );

    renderer = new THREE.WebGLRenderer({
        canvas: canvas.value,
        antialias: true,
        alpha: true,
    });

    renderer.render(scene, camera);

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    /* Light Settings */

    const hdrLoader = new UltraHDRLoader();
    const texture = await hdrLoader.loadAsync(
        'textures/brown_photostudio_01_1k.jpg',
    );
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

    /* transform controller: */

    const transformController = new TransformControls(
        camera,
        renderer.domElement,
    );
    transformController.addEventListener('dragging-changed', function (event) {
        controls.enabled = !event.value;
    });

    transformController.maxX = 4;
    transformController.maxZ = 4;

    transformController.minZ = -4;
    transformController.minX = -4;

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

    /* Model Loader: */

    loader = new GLTFLoader();
    const modelGlb = await loader.loadAsync('/models/hallingdal-547.glb');
    const model = modelGlb.scene;
    model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.name = 'model';
            child.userData.modelRoot = model;
        }
    });

    scene.add(model);
    const validModelPosition = model.position.clone();
    activeObject = model;

    /* bounding box geometry */
    const modelBBox = new THREE.Box3();
    modelBBox.setFromObject(model);
    const modelBBoxHelper = new THREE.Box3Helper(modelBBox, 0xff0000);
    scene.add(modelBBoxHelper);

    bBoxArray.push({
        model,
        box: modelBBox,
        lastValidPosition: model.position.clone(),
    });

    activeEntry = findActiveModel(model);

    /* model related controller settings */
    scene.add(transformController.getHelper());

    transformController.setMode('translate');
    transformController.showY = false;

    /* Camerea defaults */
    camera.position.z = 3.5;
    camera.position.y = 1.5;
    camera.position.x = -2.5;

    controls.update();

    function animate() {
        controls.update();

        if (activeObject === null) {
            transformController.detach();
        }

        if (activeEntry && activeObject) {
            activeEntry = findActiveModel(activeObject) ?? null;
            activeEntry.box.setFromObject(activeObject);

            if (checkCollisions()) {
                counterTransform();
            } else {
                activeEntry.lastValidPosition.copy(activeObject.position);
            }
        }

        renderer.render(scene, camera);
    }

    /* window resizing */
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    scene.add(camera);
    document.addEventListener('click', onClick);

    function onClick(event) {
        const objectHit = getFirstObjectWithName(
            event,
            window,
            camera,
            scene,
            'model',
        );

        activeObject = objectHit?.userData.modelRoot ?? null;
        //console.log(activeObject);

        if (activeObject !== null) {
            transformController.attach(activeObject);
        }
    }

    renderer.setAnimationLoop(animate);
});

async function loadModel() {
    const loader = new GLTFLoader();
    const modelGlb = await loader.loadAsync('/models/REMIX-566.glb');
    const model = modelGlb.scene;
    model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.name = 'model';
            child.userData.modelRoot = model;
        }
    });

    model.position.z = getRandomInt(4);
    model.position.x = getRandomInt(4);

    const modelBBox = new THREE.Box3();
    modelBBox.setFromObject(model);
    const modelBBoxHelper = new THREE.Box3Helper(modelBBox, 0x89cff0);

    scene.add(model);

    bBoxArray.push({
        model,
        box: modelBBox,
        lastValidPosition: model.position.clone(),
    });

    scene.add(modelBBoxHelper);
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function checkCollisions() {
    if (!activeEntry?.box) {
        return false;
    }
    return bBoxArray.some((otherEntry) => {
        return (
            otherEntry !== activeEntry &&
            activeEntry.box.intersectsBox(otherEntry.box)
        );
    });
}

function findActiveModel(activeObject) {
    return bBoxArray.find((entry) => entry.model === activeObject);
}

function counterTransform() {
    if (!activeEntry) {
        return;
    }

    const safePosition = activeEntry.lastValidPosition.clone();

    const otherEntry = bBoxArray.find((entry) => {
        return (
            entry !== activeEntry && activeEntry.box.intersectsBox(entry.box)
        );
    });

    if (!otherEntry || otherEntry === null) {
        return;
    }

    const overlapSize = activeEntry.box
        .clone()
        .intersect(otherEntry.box)
        .getSize(new THREE.Vector3());
    //console.log(overlapSize);

    const otherEntryCenter = otherEntry.box.getCenter(new THREE.Vector3());
    const activeEntryCenter = activeEntry.box.getCenter(new THREE.Vector3());

    const isRight = activeEntryCenter.x > otherEntryCenter.x;
    const isFront = activeEntryCenter.z > otherEntryCenter.z;

    let axisTransformed = '';

    //console.log('offset x:', offsetX, 'offset z:', offsetZ);

    if (overlapSize.x < overlapSize.z) {
        const direction = isRight ? 1 : -1;

        activeObject.position.x += (overlapSize.x + 0.01) * direction;
        axisTransformed = 'X';
    } else {
        const direction = isFront ? 1 : -1;
        activeObject.position.z += (overlapSize.z + 0.01) * direction;
        axisTransformed = 'Z';
    }

    activeEntry.box.setFromObject(activeObject);

    if (checkCollisions()) {
        if (axisTransformed === 'X') {
            activeObject.position.z = safePosition.z;
        } else {
            activeObject.position.x = safePosition.x;
        }

        //activeObject.position.copy(activeEntry.lastValidPosition);
        activeEntry.box.setFromObject(activeObject);
        return;
    }

    activeEntry.lastValidPosition.copy(activeObject.position);
}
</script>
