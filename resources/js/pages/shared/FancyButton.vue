<template>
    <button
        @click="$emit('buttonClicked')"
        class="mr-2 inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-slate-300 bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 active:bg-slate-200"
    >
        <slot></slot>
    </button>
</template>

<script>
export default {
    emits: ['buttonClicked'],
};
</script>
