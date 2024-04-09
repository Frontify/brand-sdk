import { type Config } from 'tailwindcss';

export default {
    content: ['src/**/*.{ts,tsx}'],
    prefix: 'tw-',
    corePlugins: {
        preflight: false,
    },
} satisfies Config;
