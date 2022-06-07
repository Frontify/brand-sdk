/* (c) Copyright Frontify Ltd., all rights reserved. */

import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        coverage: {
            all: true,
            reporter: ['text', 'lcov'],
            include: ['src/**/*.ts', 'src/**/*.tsx'],
        },
    },
});
