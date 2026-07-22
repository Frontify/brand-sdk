/* (c) Copyright Frontify Ltd., all rights reserved. */

// @ts-expect-error - No types for @frontify/oxlint-config-basic
import basicConfig from '@frontify/oxlint-config-basic';
import { defineConfig } from 'oxlint';

export default defineConfig({
    extends: [basicConfig],
    ignorePatterns: ['tailwind.config.*', '**/*.config.{js,mjs,cjs,ts}', '**/*.md'],
    overrides: [
        {
            files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
            jsPlugins: ['@tony.ganchev/eslint-plugin-header'],
            rules: {
                '@tony.ganchev/header/header': [
                    'error',
                    {
                        header: {
                            commentType: 'block',
                            lines: [' (c) Copyright Frontify Ltd., all rights reserved. '],
                        },
                        trailingEmptyLines: {
                            minimum: 2,
                        },
                    },
                ],
            },
        },
        {
            files: ['**/manifest.json'],
            rules: {
                'jsonc/sort-keys': 'off',
            },
        },
    ],
});
