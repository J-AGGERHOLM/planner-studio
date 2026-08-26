<template>
    <Layout>
        <div>
            <Configurator
                :model-session="modelSession"
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
                            v-for="model in meshes"
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

export default {
    components: { Layout, Panel, Configurator, FancyButton, ThumbNail },
    props: { meshes: Array },

};
</script>
