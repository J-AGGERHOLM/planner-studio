<template>
    <Layout>
        <div class="flex w-full justify-between">
            <h1>Editor</h1>

            <div class="flex flex-col justify-end gap-2">
                <Panel title="Preview" width="28rem" height="28rem"></Panel>
                <Panel title="Configurator" width="28rem" height="16rem"
                    ><Configurator></Configurator
                ></Panel>
            </div>
        </div>
    </Layout>
</template>

<script>
import Configurator from './shared/Configurator.vue';
import Layout from './shared/Layout.vue';
import Panel from './shared/Panel.vue';

export default {
    components: { Layout, Panel, Configurator },
};
</script>
