import frontifyConfig from '@frontify/eslint-config-react';
import { defineConfig } from 'eslint/config';

export default defineConfig(
    {
        ignores: ['eslint.config.mjs', '**/*.config.{js,mjs,cjs}', '**/*.md', 'dist', 'node_modules'],
    },
    frontifyConfig,
    {
        files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
        languageOptions: {
            parserOptions: {
                project: null,
            },
        },
    }
);
