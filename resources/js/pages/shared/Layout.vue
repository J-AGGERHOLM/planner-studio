<template>
    <div class="min-hfull relative min-w-full">
        <section class="absolute w-full bg-gray-200">
            <header class="flex items-center justify-between">
                <h2 class="ml-6 flex pt-3 pb-3 text-xl font-light">
                    Planner - Studio
                </h2>
                <Nav></Nav>
            </header>
            <section class="r-0 pointer-events-none fixed z-10 flex">
                <slot name="ui"></slot>
            </section>
        </section>

        <main>
            <slot> </slot>
        </main>
    </div>
</template>

<script>
import Nav from './Nav.vue';

export default {
    components: { Nav },
};
</script>
