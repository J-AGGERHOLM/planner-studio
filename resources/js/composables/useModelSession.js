import { readonly, ref } from 'vue';
import { fetchGet, fetchPost, fetchDelete } from '../util/fetchUtil.js';

export function useModelSession(meshes) {
    const modelSession = ref([]);

    async function loadSession() {
        const response = await fetchGet('/sessions');
        console.log('fetched:', response);
        modelSession.value = response.modelSession ?? [];
    }

    async function updateModelSession(newData) {
        console.log('updating model session', newData);
        const model = meshes.find((model) => model.id === newData.id);

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

        modelSession.value = [...modelSession.value, ...newSessionData];

        await fetchPost('/sessions', {
            modelSession: modelSession.value,
        });
    }

    async function resetSession() {
        console.log('resettingSession');
        await fetchDelete('/sessions');
        modelSession.value = [];
    }

    return {
        modelSession: readonly(modelSession),

        loadSession,
        updateModelSession,
        resetSession,
    };
}
