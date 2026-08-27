<template>
    <canvas ref="canvas" class="absolute -z-10 m-0 h-full w-full p-0"></canvas>
</template>

<script setup>
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { UltraHDRLoader } from 'three/addons/loaders/UltraHDRLoader.js';
import { inject, onMounted, ref } from 'vue';
import { useModelRequest } from '@/composables/useModelRequest.js';
import { useModelSession } from '@/composables/useModelSession.js';
import { ModelManager } from '../../util/modelManager.js';

/* Base scene set-up */

const canvas = ref(null);
let scene;
let camera;
let renderer;
let modelManager;

let renderRequest = true;

const meshes = inject('meshes');

const { modelSession, loadSession, updateModelSession } =
    useModelSession(meshes);

const { modelRequest } = useModelRequest();

onMounted(async () => {
    await loadSession();
    console.log(
        'this is currently the contents of the modelsession:  ',
        modelSession.value,
    );

    scene = new THREE.Scene();
    modelManager = new ModelManager(scene, () => {
        renderRequest = true;
    });
    camera = new THREE.PerspectiveCamera(
        35,
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
    spotLight.intensity = 40;
    spotLight.distance = 20;
    spotLight.penumbra = 1;
    spotLight.position.set(0, 8, 0);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.set(1024, 1024);
    spotLight.shadow.radius = 16;

    scene.add(spotLight);

    /* controls: */
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', function () {
        renderRequest = true;
    });

    /* transform controller: */

    const transformController = new TransformControls(
        camera,
        renderer.domElement,
    );
    transformController.addEventListener('dragging-changed', function (event) {
        controls.enabled = !event.value;
        renderRequest = true;
    });
    transformController.addEventListener('objectChange', function () {
        renderRequest = true;
    });
    transformController.addEventListener('mouseUp', () => {
        const active = modelManager.getActiveEntry();

        if (!active) {
            return;
        }

        updateModelSession({
            id: active.id,
            uuid: active.uuid,
            position: {
                x: active.lastValidPosition.x,
                y: active.lastValidPosition.y,
                z: active.lastValidPosition.z,
            },
        });
    });

    transformController.setTranslationSnap(0.5);

    transformController.maxX = 4;
    transformController.maxZ = 4;

    transformController.minZ = -4;
    transformController.minX = -4;

    /* floorShadow plane: */
    const floorGeometry = new THREE.PlaneGeometry(30, 20);

    const floorShadow = new THREE.Mesh(
        floorGeometry,
        new THREE.ShadowMaterial({
            color: 0x000000,
            opacity: 0.25,
        }),
    );

    floorShadow.rotation.x = -Math.PI / 2;
    floorShadow.position.y = -0;
    floorShadow.receiveShadow = true;

    scene.add(floorShadow);

    const floorAlpha = await new THREE.TextureLoader().loadAsync(
        'textures/floor_texture.PNG',
    );

    floorAlpha.wrapS = THREE.RepeatWrapping;
    floorAlpha.wrapT = THREE.RepeatWrapping;

    floorAlpha.repeat.set(10, 9);

    const visibleFloor = new THREE.Mesh(
        floorGeometry,
        new THREE.MeshBasicMaterial({
            color: 0xffffff,
            alphaMap: floorAlpha,
            transparent: true,
        }),
    );

    visibleFloor.rotation.x = -Math.PI / 2;
    visibleFloor.position.y = 0.001;

    scene.add(visibleFloor);

    /* Model Loader: */

    //default model:

    if (!modelSession.value || !modelSession.value.length) {
        modelManager.loadModel(5, '/models/hallingdal-547.glb', true, false);
    } else {
        await modelManager.loadSession(modelSession.value);
    }

    if (modelRequest.value.filepath) {
        await modelManager.handleModelRequest(modelRequest.value);
        resetModelRequest();
    }

    /* model related controller settings */
    scene.add(transformController.getHelper());

    transformController.setMode('translate');
    transformController.showY = false;

    /* Camerea defaults */
    camera.position.z = 5;
    camera.position.y = 2;
    camera.position.x = -2.5;

    controls.update();

    function animate() {
        if (!renderRequest) {
            return;
        }

        controls.update();

        modelManager.updateActiveModel(transformController);

        renderer.render(scene, camera);
        renderRequest = false;
    }

    /* window resizing */
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderRequest = true;
    });

    scene.add(camera);
    document.addEventListener('click', onClick);

    function onClick(event) {
        modelManager.selectActiveModel(
            transformController,
            window,
            camera,
            event,
        );

        renderRequest = true;
    }

    renderer.setAnimationLoop(animate);
});
</script>
