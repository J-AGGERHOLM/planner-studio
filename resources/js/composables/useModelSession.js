import { readonly, ref } from 'vue';
import { fetchGet, fetchPost, fetchDelete } from '../util/fetchUtil.js';

export function useModelSession() {
    const modelSession = ref([]);

    async function loadSession() {
        const response = await fetchGet('/sessions');
        modelSession.value = response.modelSession ?? [];
    }

    async function addToSession(mesh) {
        modelSession.value.push({
            id: mesh.id,
            uuid: mesh.uuid,
            filePath: mesh.file_path,
            position: {
                x: mesh.position.x,
                y: 0,
                z: mesh.position.z,
            },
        });
    }

    async function updateModelSession(newData) {
        const model = meshes.value.find((model) => model.id === newData.id);

        if (!model) {
            return;
        }

        const modelInstantiated = modelSession.value.some(
            (entry) => entry.uuid === newData.uuid,
        );

        if (modelInstantiated) {
            modelSession.value = modelSession.value.filter(
                (entry) => entry.uuid !== newData.uuid,
            );
        }

        const newSessionData = [
            {
                id: model.id,
                uuid: newData.uuid,
                position: {
                    x: newData.position.x,
                    y: newData.position.y,
                    z: newData.position.z,
                },
                filePath: model.file_path,
            },
        ];

        modelSession.value = [...modelSession, ...newSessionData];

        await fetchPost('/sessions', {
            modelSession: modelSession.value,
        });
    }

    async function resetSession() {
        await fetchDelete('/sessions');
        modelSession.value = [];
    }

    return {
        modelSession: readonly(modelSession),

        loadSession,
        addToSession,
        updateModelSession,
        resetSession,
    };
}
