<template>
    <div
        class="pointer-events-auto m-2 rounded-md border border-white bg-gray-200 p-4 opacity-75"
        :style="{ width, height }"
    >
        <h2 class="mb-2 text-xs font-bold text-gray-500">{{ title }}</h2>

        <slot></slot>
    </div>
</template>

<script>
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
