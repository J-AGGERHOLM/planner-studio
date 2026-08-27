import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { generateUUID } from 'three/src/math/MathUtils.js';
import { addHighlight, removeHighlight } from './highlighterUtil.js';
import { getFirstObjectWithName } from './RayCastHelper.js';

export class ModelManager {
    static #instance = null;
    #scene = null;
    #activeEntry = null;
    #activeObject = null;
    #bBoxArray = [];

    constructor() {
        if (ModelManager.#instance) {
            return ModelManager.#instance;
        }

        ModelManager.#instance = this;
    }

    static getInstance() {
        return (ModelManager.#instance ??= new ModelManager());
    }

    setScene(scene) {
        this.#scene = scene;
    }

    #getScene() {
        if (!this.#scene) {
            throw new Error('there is no scene on ModalManager yet!!');
        }

        return this.#scene;
    }

    getActiveEntry() {
        return this.#activeEntry;
    }

    getActiveObject() {
        return this.#activeObject;
    }

    #generateEntryUUID() {
        const entryId = generateUUID().toString();

        return entryId;
    }

    async handleLoadRequest(request) {
        if (!request) {
            return;
        }

        await this.#loadModel(
            request.id,
            request.filePath,
            false,
            request?.randomPosition,
        );
    }

    async #loadModel(
        id,
        filePath,
        active = true,
        randomPosition = true,
        uuid = null,
    ) {
        const scene = this.#getScene();

        const loader = new GLTFLoader();
        const modelGlb = await loader.loadAsync(filePath);
        const model = modelGlb.scene;
        model.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                child.name = 'model';
                child.userData.modelRoot = model;

                const material = child.material;

                if (material instanceof THREE.MeshStandardMaterial) {
                    material.roughness = 0.75;

                    material.envMapIntensity = 1;
                    material.needsUpdate = true;
                }
            }
        });

        if (randomPosition) {
            model.position.z = this.#getRandomInt(2);
            model.position.x = this.#getRandomInt(3);
        }

        const modelBBox = new THREE.Box3();
        modelBBox.setFromObject(model);
        //const modelBBoxHelper = new THREE.Box3Helper(modelBBox, 0x89cff0);

        scene.add(model);

        this.#bBoxArray.push({
            id,
            uuid: uuid ?? this.#generateEntryUUID(),
            model,
            box: modelBBox,
            lastValidPosition: model.position.clone(),
        });

        //scene.add(modelBBoxHelper);

        if (active) {
            this.#activeObject = model;
            this.#activeEntry = this.#findActiveModel(model);
        }

        return model;
    }

    sceneCleanUp() {
        console.log('cleaning up scene');
        const scene = this.#getScene();

        for (const entry of this.#bBoxArray) {
            scene.remove(entry.model);
        }

        this.#bBoxArray.length = 0;

        this.#activeEntry = null;
        this.#activeObject = null;
    }

    async loadSession(modelSession) {
        this.sceneCleanUp();
        console.log('trying to load session: ', modelSession);

        await Promise.all(
            modelSession.map(async (model) => {
                const loadedModel = await this.#loadModel(
                    model.id,
                    model.filePath,
                    false,
                    false,
                    model.uuid,
                );
                loadedModel.position.set(
                    model.position.x,
                    model.position.y,
                    model.position.z,
                );

                const entry = this.#findActiveModel(loadedModel);

                entry.box.setFromObject(loadedModel);
                entry.lastValidPosition.copy(loadedModel.position);
            }),
        );
    }

    #getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    #checkCollisions() {
        if (!this.#activeEntry?.box) {
            return false;
        }

        return this.#bBoxArray.some((otherEntry) => {
            return (
                otherEntry !== this.#activeEntry &&
                this.#activeEntry.box.intersectsBox(otherEntry.box)
            );
        });
    }

    #findActiveModel(activeObject) {
        return this.#bBoxArray.find((entry) => entry.model === activeObject);
    }

    #counterTransform() {
        if (!this.#activeEntry) {
            return;
        }

        const safePosition = this.#activeEntry.lastValidPosition.clone();

        const otherEntry = this.#bBoxArray.find((entry) => {
            return (
                entry !== this.#activeEntry &&
                this.#activeEntry.box.intersectsBox(entry.box)
            );
        });

        if (!otherEntry || otherEntry === null) {
            return;
        }

        const overlapSize = this.#activeEntry.box
            .clone()
            .intersect(otherEntry.box)
            .getSize(new THREE.Vector3());
        //console.log(overlapSize);

        const otherEntryCenter = otherEntry.box.getCenter(new THREE.Vector3());
        const activeEntryCenter = this.#activeEntry.box.getCenter(
            new THREE.Vector3(),
        );

        const isRight = activeEntryCenter.x > otherEntryCenter.x;
        const isFront = activeEntryCenter.z > otherEntryCenter.z;

        let axisTransformed = '';

        //console.log('offset x:', offsetX, 'offset z:', offsetZ);

        if (overlapSize.x < overlapSize.z) {
            const direction = isRight ? 1 : -1;

            this.#activeObject.position.x += (overlapSize.x + 0.01) * direction;
            axisTransformed = 'X';
        } else {
            const direction = isFront ? 1 : -1;
            this.#activeObject.position.z += (overlapSize.z + 0.01) * direction;
            axisTransformed = 'Z';
        }

        this.#activeEntry.box.setFromObject(this.#activeObject);

        const insideBox = otherEntry.box.containsBox(this.#activeEntry.box);

        if (this.#checkCollisions() || insideBox) {
            if (axisTransformed === 'X') {
                this.#activeObject.position.z = safePosition.z;
            } else {
                this.#activeObject.position.x = safePosition.x;
            }

            this.#activeObject.position.copy(
                this.#activeEntry.lastValidPosition,
            );
            this.#activeEntry.box.setFromObject(this.#activeObject);

            return;
        }

        this.#activeEntry.lastValidPosition.copy(this.#activeObject.position);
    }

    updateActiveModel(transformController) {
        if (this.#activeObject === null) {
            transformController.detach();
        }

        if (this.#activeEntry && this.#activeObject) {
            this.#activeEntry =
                this.#findActiveModel(this.#activeObject) ?? null;
            this.#activeEntry.box.setFromObject(this.#activeObject);

            if (this.#checkCollisions()) {
                this.#counterTransform();
            } else {
                this.#activeEntry.lastValidPosition.copy(
                    this.#activeObject.position,
                );
            }
        }
    }

    selectActiveModel(transformController, window, camera, event) {
        const scene = this.#getScene();

        const objectHit = getFirstObjectWithName(
            event,
            window,
            camera,
            scene,
            'model',
        );

        if (this.#activeObject) {
            removeHighlight(this.#activeObject);
        }

        this.#activeObject = objectHit?.userData.modelRoot ?? null;
        //console.log#activeObject);

        if (this.#activeObject !== null) {
            this.#activeEntry = this.#findActiveModel(this.#activeObject);
            transformController.attach(this.#activeObject);
            addHighlight(this.#activeObject);
        } else {
            this.#activeEntry = null;
            transformController.detach();
        }
    }

    getActiveEntry() {
        return this.#activeEntry;
    }
}

export default ModelManager;
