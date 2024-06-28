import { type Config } from 'tailwindcss';

export default {
    presets: [require('@frontify/guideline-blocks-settings/tailwind')],
    content: ['src/**/*.{ts,tsx}'],
    prefix: 'tw-',
    corePlugins: {
        preflight: false,
    },
} satisfies Config;
