<template>
    <div
        class="bg-white/ pointer-events-auto isolate m-2 aspect-video w-96 rounded-md rounded-xl border border-white p-4 shadow-lg ring-1 ring-black/5 backdrop-blur-xl"
        :style="{ width, height }"
    >
        <h2 class="mb-2 text-xs font-bold text-gray-500">{{ title }}</h2>

        <slot></slot>
    </div>
</template>

<script lang="ts">
export default {
    components: {},
    props: {
        title: String,

        width: {
            type: String,
            default: '100%',
        },
        height: {
            type: String,
            default: 'auto',
        },
    },
};
</script>
