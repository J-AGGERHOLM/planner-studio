<script lang="ts">
import NavLink from './NavLink.vue';

export default {
    components: { NavLink },
};
</script>

<template>
    <nav class="mr-6">
        <ul class="flex items-center gap-6">
            <li>
                <NavLink href="/" :active="$page.component === 'Editor'">
                    Editor
                </NavLink>
            </li>
        </ul>
    </nav>
</template>
