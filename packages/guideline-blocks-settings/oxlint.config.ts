/* (c) Copyright Frontify Ltd., all rights reserved. */

// @ts-expect-error - No types for @frontify/oxlint-config-react
import reactConfig from '@frontify/oxlint-config-react';
import { defineConfig } from 'oxlint';

export default defineConfig({
    extends: [reactConfig],
    ignorePatterns: ['tailwind.config.*', '**/*.config.{js,mjs,cjs,ts}', '**/*.md'],
    overrides: [
        {
            files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
            jsPlugins: ['@tony.ganchev/eslint-plugin-header', 'eslint-plugin-tailwindcss'],
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
                'tailwindcss/no-custom-classname': [
                    'warn',
                    {
                        whitelist: ['^(?!tw-).*$'],
                        callees: ['className', 'sv', 'class', 'merge', 'joinClassNames'],
                        cssFiles: ['**/*.css', '!**/node_modules', '!**/.*', '!**/dist', '!**/build', '!**/public'],
                    },
                ],
                'tailwindcss/no-contradicting-classname': 'error',
                'tailwindcss/enforces-negative-arbitrary-values': 'error',
                'tailwindcss/no-unnecessary-arbitrary-value': 'error',
                '@eslint-react/dom-no-missing-button-type': 'warn',
                '@eslint-react/no-unnecessary-use-prefix': 'warn',
                '@eslint-react/no-unstable-context-value': 'warn',
                'typescript/no-explicit-any': 'warn',
                'typescript/no-floating-promises': 'warn',
                'typescript/no-unsafe-argument': 'warn',
                'typescript/no-unsafe-enum-comparison': 'warn',
                'typescript/no-require-imports': 'warn',
                'typescript/no-unused-expressions': 'warn',
                'typescript/no-unnecessary-type-assertion': 'warn',
                'typescript/no-unsafe-assignment': 'warn',
                'typescript/no-unsafe-call': 'warn',
                'typescript/no-unsafe-member-access': 'warn',
                'typescript/no-unsafe-return': 'warn',
                'no-prototype-builtins': 'warn',
                'no-unused-expressions': 'warn',
                'promise/always-return': 'warn',
                'promise/catch-or-return': 'warn',
                'unicorn/prefer-dom-node-text-content': 'warn',
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
