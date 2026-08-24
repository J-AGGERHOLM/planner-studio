<template>
    <Layout>
        <div>
            <Configurator
                :model-request="modelRequest"
                :model-session="modelSession"
                :session-version="sessionVersion"
                :loading-finished="loadingFinished"
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
                        <FancyButton @button-clicked="emptySessionData"
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
import { fetchGet, fetchPost, fetchDelete } from '../util/fetchUtil.js';
import Configurator from './shared/Configurator.vue';
import FancyButton from './shared/FancyButton.vue';
import Layout from './shared/Layout.vue';
import Panel from './shared/Panel.vue';
import ThumbNail from './shared/ThumbNail.vue';

export default {
    components: { Layout, Panel, Configurator, FancyButton, ThumbNail },
    props: { threeDModels: Array },

    async mounted() {
        const response = await fetchGet('/sessions');

        this.modelSession = response.modelSession ?? [];
        this.loadingFinished = true;

        this.sessionVersion++;
    },

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
        async updateSessionData(newData) {
            const model = this.threeDModels.find(
                (model) => model.id === newData.id,
            );

            if (!model) {
                return;
            }

            const modelInstantiated = this.modelSession.some(
                (entry) => entry.uuid === newData.uuid,
            );

            if (modelInstantiated) {
                this.modelSession = this.modelSession.filter(
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

            this.modelSession = [...this.modelSession, ...newSessionData];

            await fetchPost('/sessions', {
                modelSession: this.modelSession,
            });
        },
        async emptySessionData() {
            await fetchDelete('/sessions');
            this.modelSession.length = 0;
            this.sessionVersion++;
        },
    },
    data() {
        return {
            modelRequest: null,
            modelSession: [],
            sessionVersion: 0,
            loadingFinished: false,
        };
    },
};
</script>
