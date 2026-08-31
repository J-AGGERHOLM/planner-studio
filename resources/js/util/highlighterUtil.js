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

const outLineMaterial = new THREE.MeshStandardMaterial({
    color: 0xffea36,

    emissive: 0xffea36,
    emissiveIntensity: 0.5,

    polygonOffset: true,
    polygonOffsetFactor: -5,
    polygonOffsetUnits: -5,
});

outLineMaterial.side = THREE.BackSide;

const highlightMaterial = new THREE.ShaderMaterial({
    uniforms: {
        fresnelColor: {
            value: new THREE.Color(0xfff87a),
        },
        fresnelPower: {
            value: 2.0,
        },
        highlightTexture: {
            value: highlightTexture,
        },
        alphaTexture: {
            value: alphaTexture,
        },
        opacity: {
            value: 1,
        },
    },

    vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewDirection;
        varying vec2 vUv;


        void main() {
            vec4 worldPosition = modelMatrix * vec4(position, 1.0);

            vNormal = normalize(mat3(modelMatrix) * normal);
            vViewDirection = normalize(cameraPosition - worldPosition.xyz);

            vUv = uv;

            gl_Position = projectionMatrix * viewMatrix * worldPosition;

        }
    `,

    fragmentShader: `
        uniform vec3 fresnelColor;
        uniform float fresnelPower;
        uniform sampler2D highlightTexture;
        uniform sampler2D alphaTexture;
        uniform float opacity;


        varying vec3 vNormal;
        varying vec3 vViewDirection;
        varying vec2 vUv;

        void main() {
            float fresnel = pow(
                1.0 - max(dot(vNormal, vViewDirection), 0.0),
                fresnelPower
            );

             vec4 textureColor = texture2D(highlightTexture, vUv);
             float alpha = texture2D(alphaTexture, vUv).r;

            gl_FragColor = vec4(
            fresnelColor * fresnel * textureColor.rgb, 
            alpha * fresnel * opacity);
        }
    `,

    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,

    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1,
});

export function addHighlight(model) {
    const meshes = [];

    model.traverse((child) => {
        if (
            (child instanceof THREE.Mesh &&
                child.name !== 'selectionHighlight') ||
            child.name !== 'selectionOutline'
        ) {
            meshes.push(child);
        }
    });

    for (const mesh of meshes) {
        const highlight = new THREE.Mesh(mesh.geometry, highlightMaterial);
        const outline = new THREE.Mesh(mesh.geometry, outLineMaterial);

        highlight.name = 'selectionHighlight';
        outline.name = 'selectionOutline';

        mesh.add(highlight);
        mesh.add(outline);
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

        const outline = child.children.find(
            (object) => object.name === 'selectionOutline',
        );

        if (highlight) {
            child.remove(highlight);
        }

        if (outline) {
            child.remove(outline);
        }
    });
}
