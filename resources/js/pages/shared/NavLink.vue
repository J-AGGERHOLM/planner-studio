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
        class="rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
        :class="{ 'bg-black font-bold text-white': active }"
    >
        <slot></slot
    ></Link>
</template>
