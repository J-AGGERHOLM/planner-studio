<template>
    <Layout>
        <div>
            <Configurator></Configurator>
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
    props: { threeDModels: Array },
};
</script>
