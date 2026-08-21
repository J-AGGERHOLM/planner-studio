<template>
    <Layout>
        <div>
            <Configurator
                :model-request="modelRequest"
                @session-update="updateSessionData"
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
                        <FancyButton
                            ><FontAwesomeIcon :icon="['fas', 'rotate-right']" />
                            Restart</FancyButton
                        >
                    </div>
                    <div class="mt-4 grid grid-cols-3 gap-3">
                        <ThumbNail
                            v-for="model in threeDModels"
                            :key="model.id"
                            :imagePath="model.thumbnail_path"
                            :alt="model.name"
                            :id="model.id"
                            @model-chosen="handleModelRequest"
                        ></ThumbNail>
                    </div>
                </Panel>
            </div>
        </template>
    </Layout>
</template>

<script>
import Configurator from './shared/Configurator.vue';
import FancyButton from './shared/FancyButton.vue';
import Layout from './shared/Layout.vue';
import Panel from './shared/Panel.vue';
import ThumbNail from './shared/ThumbNail.vue';
import { router } from '@inertiajs/vue3';

export default {
    components: { Layout, Panel, Configurator, FancyButton, ThumbNail, router },
    props: { threeDModels: Array },
    methods: {
        handleModelRequest(id) {
            const selectedModel = this.threeDModels.find(
                (model) => model.id === id,
            );

            if (!selectedModel) {
                return;
            }

            this.modelRequest = {
                id: selectedModel.id,
                filePath: selectedModel.file_path,
            };
        },
        updateSessionData(newData) {
            const model = this.threeDModels.find(
                (model) => model.id === newData.id,
            );

            if (!model) {
                return;
            }

            const newSessionData = [
                {
                    id: model.id,
                    position: {
                        x: newData.position.x,
                        y: newData.position.y,
                        z: newData.position.z,
                    },
                    filePath: model.file_path,
                },
            ];

            this.modelSession = [...this.modelSession, ...newSessionData];

            router.post('/sessions', {
                modelSession: this.modelSession,
            });
        },
    },
    data() {
        return {
            modelRequest: null,
            modelSession: [],
        };
    },
};
</script>
