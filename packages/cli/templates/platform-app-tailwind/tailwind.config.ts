import frontifyTailwindConfig from '@frontify/fondue/tokens/tailwind';
import { type Config } from 'tailwindcss';

export default {
    presets: [frontifyTailwindConfig],
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {},
    },
    plugins: [],
} satisfies Config;
