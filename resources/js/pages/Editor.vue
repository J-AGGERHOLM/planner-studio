<template>
    <Layout>
        <div>
            <Configurator></Configurator>
        </div>
        <template #ui>
            <div>
                <Panel title="Catalogue" width="28rem" height="34vh">
                    <FancyButton
                        ><FontAwesomeIcon :icon="['fas', 'plus']" />
                        Add</FancyButton
                    >
                </Panel>
                <Panel title="Settings" width="28rem" height="59vh"></Panel>
            </div>
        </template>
    </Layout>
</template>

<script lang="ts">
import Configurator from './shared/Configurator.vue';
import FancyButton from './shared/FancyButton.vue';
import Layout from './shared/Layout.vue';
import Panel from './shared/Panel.vue';

export default {
    components: { Layout, Panel, Configurator, FancyButton },
};
</script>
