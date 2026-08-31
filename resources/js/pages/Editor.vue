<template>
    <Layout>
        <div>
            <Configurator @model-u-i-update="handleModelUI"></Configurator>
        </div>
        <template #ui>
            <div>
                <Panel title="Catalogue" width="28rem" height="92%">
                    <div class="mt-auto flex w-full justify-end">
                        <FancyButton @button-clicked="handleReset"
                            ><FontAwesomeIcon :icon="['fas', 'rotate-right']" />
                            Restart</FancyButton
                        >
                    </div>
                    <div class="mt-4 grid grid-cols-3 gap-3">
                        <ThumbNail
                            v-for="model in props.meshes"
                            :key="model.id"
                            :imagePath="model.thumbnail_path"
                            :alt="model.name"
                            :id="model.id"
                            @model-chosen="handleModelChosen"
                        ></ThumbNail>
                    </div>
                </Panel>
            </div>
            <ModelUi
                v-if="modelUIPosition"
                :style="{
                    left: `${modelUIPosition.x}px`,
                    top: `${modelUIPosition.y}px`,
                }"
            >
            </ModelUi>
        </template>
    </Layout>
</template>

<script setup>
import { provide, ref } from 'vue';
import { useRenderRequest } from '@/composables/useRenderRequest.js';
import ModelManager from '@/util/modelManager.js';
import { useModelRequest } from '../composables/useModelRequest.js';
import { useModelSession } from '../composables/useModelSession.js';
import Configurator from './shared/Configurator.vue';
import FancyButton from './shared/FancyButton.vue';
import Layout from './shared/Layout.vue';
import Panel from './shared/Panel.vue';
import ThumbNail from './shared/ThumbNail.vue';
import ModelUi from './shared/ModelUI.vue';

const modelManager = ModelManager.getInstance();
const modelUIPosition = ref(null);

const props = defineProps({
    meshes: {
        type: Array,
        default: () => [],
    },
});

provide('meshes', props.meshes);

const { resetSession } = useModelSession(props.meshes);
const { modelRequest, updateModelRequest } = useModelRequest();
const { renderRequest, setRenderRequestTrue } = useRenderRequest();

function handleReset() {
    resetSession();
    modelManager.sceneCleanUp();
    setRenderRequestTrue();
}

async function handleModelChosen(id) {
    const mesh = props.meshes.find((mesh) => mesh.id === id);

    if (!mesh) {
        return;
    }

    updateModelRequest(mesh);
    await modelManager.handleLoadRequest(modelRequest.value);
    setRenderRequestTrue();
    console.log('chose a model', renderRequest.value);
}

function handleModelUI(position) {
    modelUIPosition.value = position;
}
</script>
