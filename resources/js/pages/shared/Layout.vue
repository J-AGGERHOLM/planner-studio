<template>
    <div class="">
        <section class="bg-gray-200">
            <header class="flex items-center justify-between">
                <h2 class="ml-6 flex pt-3 pb-3 text-xl font-light">
                    Planner - Studio
                </h2>
                <Nav></Nav>
            </header>
        </section>

        <main>
            <slot> </slot>
        </main>

        <!-- <section class="pointer-events-none flex justify-end">
            <slot name="ui"></slot>
        </section> -->
    </div>
</template>

<script>
import Nav from './Nav.vue';

export default {
    components: { Nav },
};
</script>
