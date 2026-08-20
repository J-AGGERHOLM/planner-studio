<template>
    <div
        class="aspect-square w-full cursor-pointer overflow-hidden rounded-lg border border-slate-200 bg-slate-100 shadow-sm transition hover:border-slate-100 hover:bg-white hover:shadow-md"
    >
        <button @click="$emit('modelChosen', id)">
            <img
                :src="imagePath"
                :alt="alt"
                class="h-full w-full object-contain"
            />
        </button>
    </div>
</template>

<script>
export default {
    components: {},
    props: {
        alt: String,
        imagePath: String,
        id: Number,
    },
    emits: ['modelChosen'],
};
</script>
