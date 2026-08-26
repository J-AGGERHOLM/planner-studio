<template>
    <Layout>
        <div>
            <Configurator
                :model-session="modelSession"
                @session-update="updateModelSession"
            ></Configurator>
        </div>
        <template #ui>
            <div>
                <Panel title="Catalogue" width="28rem" height="92%">
                    <div class="">
                        <FancyButton
                            ><FontAwesomeIcon :icon="['fas', 'plus']" />
                            Add</FancyButton
                        >
                        <FancyButton @button-clicked="resetSession"
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
        </template>
    </Layout>
</template>

<script setup>
import { onMounted } from 'vue';
import { useModelSession } from '../composables/useModelSession.js';
import Configurator from './shared/Configurator.vue';
import FancyButton from './shared/FancyButton.vue';
import Layout from './shared/Layout.vue';
import Panel from './shared/Panel.vue';
import ThumbNail from './shared/ThumbNail.vue';

const {
    modelSession,
    loadSession,
    addToSession,
    updateModelSession,
    resetSession,
} = useModelSession();

const props = defineProps({
    meshes: {
        type: Array,
        default: () => [],
    },
});

function handleModelChosen(id) {
    const mesh = props.meshes.find((mesh) => mesh.id === id);

    if (!mesh) {
        return;
    }

    addToSession(mesh);
}

onMounted(() => {
    loadSession();
});
</script>
