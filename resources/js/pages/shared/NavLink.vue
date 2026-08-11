<script>
import { Link } from '@inertiajs/vue3';

export default {
    components: { Link },
    props: {
        active: Boolean,
    },
};
</script>

<template>
    <Link
        class="font-300 rounded-md px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
        :class="{ 'bg-black font-normal text-white': active }"
    >
        <slot></slot
    ></Link>
</template>
