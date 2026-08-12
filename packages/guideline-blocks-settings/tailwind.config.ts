/* (c) Copyright Frontify Ltd., all rights reserved. */

import frontifyTailwindConfig from '@frontify/fondue/tokens/tailwind';
import containerQueryPlugin from '@tailwindcss/container-queries';
import plugin from 'tailwindcss/plugin';
import { type ThemeConfig } from 'tailwindcss/types/config';

module.exports = {
    prefix: 'tw-',
    content: ['src/**/*.{ts,tsx}'],
    presets: [frontifyTailwindConfig],
    corePlugins: {
        preflight: false,
    },
    plugins: [
        containerQueryPlugin,
        plugin(({ addBase }) => {
            addBase({
                '*': { boxSizing: 'content-box' },
                '::before': { boxSizing: 'content-box' },
                '::after': { boxSizing: 'content-box' },
            });
        }),
    ],
    theme: {
        extend: {
            containers: {
                sm: '440px',
                md: '740px',
                lg: '1240px',
            },
            outlineColor: ({ theme }: { theme: (path: string) => ThemeConfig }) => ({
                ...theme('colors'),
            }),
            outlineWidth: {
                0: '0px',
                1: '1px',
                2: '2px',
                4: '4px',
                8: '8px',
            },
            outlineOffset: {
                0: '0px',
                1: '1px',
                2: '2px',
                4: '4px',
            },
        },
    },
};
