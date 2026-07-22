/* (c) Copyright Frontify Ltd., all rights reserved. */

// @ts-expect-error - No types for @frontify/oxlint-config-react
import reactConfig from '@frontify/oxlint-config-react';
import { defineConfig } from 'oxlint';

export default defineConfig({
    extends: [reactConfig],
    ignorePatterns: ['tailwind.config.*', '**/*.config.{js,mjs,cjs,ts}', '**/*.md', 'src/workers/upload.worker.js'],
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
                'no-prototype-builtins': 'warn',
                'typescript/no-explicit-any': 'warn',
                'typescript/no-floating-promises': 'warn',
                'typescript/no-misused-promises': 'warn',
                'typescript/no-unsafe-argument': 'warn',
                'typescript/require-await': 'warn',
                'typescript/await-thenable': 'warn',
                'typescript/no-unsafe-enum-comparison': 'warn',
                'typescript/restrict-plus-operands': 'warn',
                'typescript/no-unnecessary-type-assertion': 'warn',
                'typescript/no-redundant-type-constituents': 'off',
                'typescript/no-unsafe-assignment': 'off',
                'typescript/no-unsafe-call': 'off',
                'typescript/no-unsafe-member-access': 'off',
                'typescript/no-unsafe-return': 'off',
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
