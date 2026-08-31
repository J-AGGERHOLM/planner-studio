import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faBox,
    faGear,
    faPlus,
    faRotateRight,
    faRotateLeft,
    faSliders,
    faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { createInertiaApp } from '@inertiajs/vue3';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

library.add(
    faBox,
    faGear,
    faPlus,
    faSliders,
    faRotateRight,
    faRotateLeft,
    faTrash,
);

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    progress: {
        color: '#4B5563',
    },
    withApp(app) {
        app.component('FontAwesomeIcon', FontAwesomeIcon);
    },
});
