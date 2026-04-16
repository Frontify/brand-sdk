/* (c) Copyright Frontify Ltd., all rights reserved. */

// @ts-check

// @ts-expect-error No types available
import frontifyConfig from '@frontify/eslint-config-react';
import headerPlugin from '@tony.ganchev/eslint-plugin-header';
import { defineConfig } from 'eslint/config';

export default defineConfig(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    frontifyConfig,
    {
        ignores: ['dist/', 'coverage/', 'node_modules/', '**/*.md/**.ts', '**/*.md', 'src/workers/upload.worker.js'],
    },
    {
        files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts', '**/*.cjs'],
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        plugins: {
            '@tony.ganchev': headerPlugin,
        },
        rules: {
            // Copyright header rules
            '@tony.ganchev/header': [
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

            '@typescript-eslint/no-redundant-type-constituents': 'warn',
            'no-prototype-builtins': 'warn',
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-floating-promises': 'warn',
            '@typescript-eslint/no-misused-promises': 'warn',
            '@typescript-eslint/no-unsafe-argument': 'warn',
            '@typescript-eslint/no-unsafe-assignment': 'off',
            '@typescript-eslint/no-unsafe-call': 'warn',
            '@typescript-eslint/no-unsafe-member-access': 'warn',
            '@typescript-eslint/no-unsafe-return': 'warn',
            '@typescript-eslint/await-thenable': 'warn',
            '@typescript-eslint/no-unsafe-enum-comparison': 'warn',
            '@typescript-eslint/restrict-plus-operands': 'warn',
        },
    },
);
