import * as THREE from 'three';
import { readonly, ref } from 'vue';
const modelUIPosition = ref(null);

export function useModelUI() {
    function toScreenPosition(camera, renderer, entry) {
        if (!entry) {
            return;
        }

        const vector = getBoxPoints(entry);

        const widthHalf = 0.5 * renderer.domElement.clientWidth;
        const heightHalf = 0.5 * renderer.domElement.clientHeight;

        vector.project(camera);

        vector.x = vector.x * widthHalf + widthHalf;
        vector.y = -vector.y * heightHalf + heightHalf;

        return {
            x: vector.x,
            y: vector.y,
        };
    }

    function getBoxPoints(entry) {
        return new THREE.Vector3(
            entry.box.max.x,
            entry.box.max.y,
            entry.box.max.z,
        );
    }

    function updateModelUI(camera, renderer, entry) {
        const position = toScreenPosition(camera, renderer, entry);

        modelUIPosition.value = position ?? null;
    }

    return {
        modelUIPosition: readonly(modelUIPosition),
        updateModelUI,
    };
}
