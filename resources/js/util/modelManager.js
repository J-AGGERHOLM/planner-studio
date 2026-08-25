import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { generateUUID } from 'three/src/math/MathUtils.js';
import { getFirstObjectWithName } from './RayCastHelper.js';

export class ModelManager {
    constructor(scene, renderRequest) {
        this.scene = scene;
        this.renderRequest = renderRequest;
        this.activeEntry = null;
        this.activeObject = null;

        this.bBoxArray = [];
    }

    generateEntryUUID() {
        const entryId = generateUUID().toString();

        return entryId;
    }

    handleModelRequest(request) {
        if (!request) {
            return;
        }

        this.loadModel(request.id, request.filePath, false, true);
    }

    async loadModel(id, filePath, active, randomPosition, uuid = null) {
        const loader = new GLTFLoader();
        const modelGlb = await loader.loadAsync(filePath);
        const model = modelGlb.scene;
        model.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.name = 'model';
                child.userData.modelRoot = model;
            }
        });

        if (randomPosition) {
            model.position.z = this.getRandomInt(2);
            model.position.x = this.getRandomInt(3);
        }

        const modelBBox = new THREE.Box3();
        modelBBox.setFromObject(model);
        //const modelBBoxHelper = new THREE.Box3Helper(modelBBox, 0x89cff0);

        this.scene.add(model);

        this.bBoxArray.push({
            id,
            uuid: uuid ?? this.generateEntryUUID(),
            model,
            box: modelBBox,
            lastValidPosition: model.position.clone(),
        });

        //scene.add(modelBBoxHelper);

        if (active) {
            this.activeObject = model;
            this.activeEntry = this.findActiveModel(model);
        }

        this.renderRequest();

        return model;
    }

    sceneCleanUp() {
        for (const entry of this.bBoxArray) {
            this.scene.remove(entry.model);
            this.scene.remove(entry.box);
        }

        this.bBoxArray.length = 0;

        this.activeEntry = null;
        this.activeObject = null;

        this.renderRequest();
    }

    async loadSession(modelSession) {
        this.sceneCleanUp();
        console.log('trying to load session: ', modelSession);
        modelSession.map(async (model) => {
            const loadedModel = await this.loadModel(
                model.id,
                model.filePath,
                true,
                false,
                model.uuid,
            );
            loadedModel.position.set(
                model.position.x,
                model.position.y,
                model.position.z,
            );

            const entry = this.findActiveModel(loadedModel);

            entry.box.setFromObject(loadedModel);
            entry.lastValidPosition.copy(loadedModel.position);
        });

        this.renderRequest();
    }

    getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    checkCollisions() {
        if (!this.activeEntry?.box) {
            return false;
        }

        return this.bBoxArray.some((otherEntry) => {
            return (
                otherEntry !== this.activeEntry &&
                this.activeEntry.box.intersectsBox(otherEntry.box)
            );
        });
    }

    findActiveModel(activeObject) {
        return this.bBoxArray.find((entry) => entry.model === activeObject);
    }

    counterTransform() {
        if (!this.activeEntry) {
            return;
        }

        const safePosition = this.activeEntry.lastValidPosition.clone();

        const otherEntry = this.bBoxArray.find((entry) => {
            return (
                entry !== this.activeEntry &&
                this.activeEntry.box.intersectsBox(entry.box)
            );
        });

        if (!otherEntry || otherEntry === null) {
            return;
        }

        const overlapSize = this.activeEntry.box
            .clone()
            .intersect(otherEntry.box)
            .getSize(new THREE.Vector3());
        //console.log(overlapSize);

        const otherEntryCenter = otherEntry.box.getCenter(new THREE.Vector3());
        const activeEntryCenter = this.activeEntry.box.getCenter(
            new THREE.Vector3(),
        );

        const isRight = activeEntryCenter.x > otherEntryCenter.x;
        const isFront = activeEntryCenter.z > otherEntryCenter.z;

        let axisTransformed = '';

        //console.log('offset x:', offsetX, 'offset z:', offsetZ);

        if (overlapSize.x < overlapSize.z) {
            const direction = isRight ? 1 : -1;

            this.activeObject.position.x += (overlapSize.x + 0.01) * direction;
            axisTransformed = 'X';
        } else {
            const direction = isFront ? 1 : -1;
            this.activeObject.position.z += (overlapSize.z + 0.01) * direction;
            axisTransformed = 'Z';
        }

        this.activeEntry.box.setFromObject(this.activeObject);

        const insideBox = otherEntry.box.containsBox(this.activeEntry.box);

        if (this.checkCollisions() || insideBox) {
            if (axisTransformed === 'X') {
                this.activeObject.position.z = safePosition.z;
            } else {
                this.activeObject.position.x = safePosition.x;
            }

            //activeObject.position.copy(activeEntry.lastValidPosition);
            this.activeEntry.box.setFromObject(this.activeObject);

            return;
        }

        this.activeEntry.lastValidPosition.copy(this.activeObject.position);
    }

    updateActiveModel(transformController) {
        if (this.activeObject === null) {
            transformController.detach();
        }

        if (this.activeEntry && this.activeObject) {
            this.activeEntry = this.findActiveModel(this.activeObject) ?? null;
            this.activeEntry.box.setFromObject(this.activeObject);

            if (this.checkCollisions()) {
                this.counterTransform();
            } else {
                this.activeEntry.lastValidPosition.copy(
                    this.activeObject.position,
                );
            }
        }
    }

    selectActiveModel(transformController, window, camera, event) {
        const objectHit = getFirstObjectWithName(
            event,
            window,
            camera,
            this.scene,
            'model',
        );

        this.activeObject = objectHit?.userData.modelRoot ?? null;
        //console.log(activeObject);

        if (this.activeObject !== null) {
            transformController.attach(this.activeObject);
        }
    }

    getActiveEntry() {
        return this.activeEntry;
    }
}
