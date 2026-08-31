import { readonly, ref } from 'vue';

const renderRequest = ref(true);

export function useRenderRequest() {
    function setRenderRequestFalse() {
        renderRequest.value = false;
    }

    function setRenderRequestTrue() {
        renderRequest.value = true;
    }

    return {
        renderRequest: readonly(renderRequest),
        setRenderRequestFalse,
        setRenderRequestTrue,
    };
}
