import { generateUUID } from 'three/src/math/MathUtils.js';

export function generateEntryUUID() {
    const entryId = generateUUID().toString();

    return entryId;
}
