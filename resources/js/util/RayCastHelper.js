import * as THREE from 'three';

export function getFirstObjectWithName(event, viewport, camera, scene, name) {
    const raycaster = new THREE.Raycaster();

    const mousePointer = getMouseVector2(event, viewport);

    const intersections = checkRayIntersections(
        mousePointer,
        camera,
        raycaster,
        scene,
    );

    const objects = getObjectsByName(intersections, name);

    return objects[0] ?? null;
}

export function getMouseVector2(event, viewport) {
    const mousePointer = new THREE.Vector2();

    mousePointer.x = (event.clientX / viewport.innerWidth) * 2 - 1;
    mousePointer.y = -(event.clientY / viewport.innerHeight) * 2 + 1;

    return mousePointer;
}

export function checkRayIntersections(mousePointer, camera, raycaster, scene) {
    raycaster.setFromCamera(mousePointer, camera);

    return raycaster.intersectObjects(scene.children, true);
}

export function getObjectsByName(intersections, name) {
    const matchingObjects = [];

    intersections.forEach((intersection) => {
        const objectName = intersection.object.name || 'Unnamed Object';

        if (objectName.includes(name)) {
            matchingObjects.push(intersection.object);
        }
    });

    return matchingObjects;
}
