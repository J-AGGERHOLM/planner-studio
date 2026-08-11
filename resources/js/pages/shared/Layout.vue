<template>
    <section class="bg-gray-200">
        <header class="flex items-center justify-between">
            <h2 class="ml-6 flex pt-3 pb-3 text-xl font-light">
                Planner - Studio
            </h2>
            <Nav></Nav>
        </header>
    </section>
    <section class="m-2 flex gap-6">
        <slot></slot>
    </section>
</template>

<script>
import Nav from './Nav.vue';

export default {
    components: { Nav },
};
</script>
