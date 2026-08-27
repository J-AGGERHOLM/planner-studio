import { readonly, ref } from 'vue';

export function useModelRequest() {
    const modelRequest = ref({});

    function updateModelRequest(mesh) {
        modelRequest.value = {
            id: mesh.id,
            filepath: mesh.file_path,
        };
    }

    function resetModelRequest() {
        modelRequest.value = null;
    }

    return {
        modelRequest: readonly(modelRequest),
        updateModelRequest,
        resetModelRequest,
    };
}
