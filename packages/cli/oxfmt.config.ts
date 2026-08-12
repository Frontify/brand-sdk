/* (c) Copyright Frontify Ltd., all rights reserved. */

// @ts-expect-error - No types for oxfmt-config
import { defineConfig } from '@frontify/oxfmt-config';

export default defineConfig({
    trailingComma: 'all',
    ignorePatterns: ['templates'],
    overrides: [
        {
            files: ['tsconfig.json', 'tsconfig.*.json'],
            options: {
                trailingComma: 'none',
            },
        },
    ],
});
