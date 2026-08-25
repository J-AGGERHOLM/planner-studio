import * as THREE from 'three';

/* Material set-up: */

const highlightTexture = new THREE.TextureLoader().load(
    '/textures/grid_lighter.png',
);

highlightTexture.wrapS = THREE.RepeatWrapping;
highlightTexture.wrapT = THREE.RepeatWrapping;

highlightTexture.repeat.set(1, 1);

const alphaTexture = new THREE.TextureLoader().load('/textures/grid_dark.png');

alphaTexture.wrapS = THREE.RepeatWrapping;
alphaTexture.wrapT = THREE.RepeatWrapping;

alphaTexture.repeat.set(1, 1);

export const highlightMaterial = new THREE.MeshStandardMaterial({
    color: 0xc7fff8,

    emissive: 0x5cfaec,
    emissiveIntensity: 0.5,
    emissiveMap: alphaTexture,

    alphaMap: highlightTexture,
    transparent: true,
    opacity: 0.25,

    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1,
});

export function addHighlight(model) {
    const meshes = [];

    model.traverse((child) => {
        if (
            child instanceof THREE.Mesh &&
            child.name !== 'selectionHighlight'
        ) {
            meshes.push(child);
        }
    });

    for (const mesh of meshes) {
        const highlight = new THREE.Mesh(mesh.geometry, highlightMaterial);

        highlight.name = 'selectionHighlight';

        mesh.add(highlight);
    }
}

export function removeHighlight(model) {
    model.traverse((child) => {
        if (!(child instanceof THREE.Mesh)) {
            return;
        }

        const highlight = child.children.find(
            (object) => object.name === 'selectionHighlight',
        );

        if (highlight) {
            child.remove(highlight);
        }
    });
}
