/* (c) Copyright Frontify Ltd., all rights reserved. */

import containerQueryPlugin from '@tailwindcss/container-queries';

module.exports = {
    presets: [require('@frontify/fondue/tailwind')],
    content: ['src/**/*.{ts,tsx}'],
    corePlugins: {
        preflight: false,
    },
    plugins: [containerQueryPlugin],
};
