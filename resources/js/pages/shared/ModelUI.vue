<template>
    <div
        class="pointer-events-auto absolute top-50 left-250 flex flex-col items-center justify-center rounded-sm border-slate-200 bg-slate-100 shadow-sm"
    >
        <ModelUI_button>
            <FontAwesomeIcon :icon="['fas', 'rotate-right']" />
        </ModelUI_button>
        <ModelUI_button>
            <FontAwesomeIcon :icon="['fas', 'rotate-left']" />
        </ModelUI_button>
        <ModelUI_button>
            <FontAwesomeIcon :icon="['fas', 'trash']" />
        </ModelUI_button>
    </div>
</template>
<script setup>
import ModelUI_button from './ModelUI_button.vue';
</script>
