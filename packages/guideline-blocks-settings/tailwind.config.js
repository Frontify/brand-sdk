/* (c) Copyright Frontify Ltd., all rights reserved. */

module.exports = {
    presets: [require('@frontify/fondue/tailwind')],
    content: ['src/**/*.{ts,tsx}'],
    corePlugins: {
        preflight: false,
    },
    theme: {
        extend: {
            colors: {
                'blank-state-weak': '#ABADAD',
                'blank-state-weak-inverse': '#FFFFFF',
                'blank-state-shaded': '#727474',
                'blank-state-shaded-inverse': '#FAFAFA',
                'blank-state-weighted': '#696B6B',
                'blank-state-weighted-inverse': '#F1F1F1',
                'blank-state-hover': '#1A1C1C',
                'blank-state-hover-inverse': '#FFFFFF',
                'blank-state-pressed': '#080808',
                'blank-state-pressed-inverse': '#F1F1F1',
                'blank-state-line': '#A3A5A5',
                'blank-state-line-hover': '#1A1C1C',
            },
        },
    },
};
