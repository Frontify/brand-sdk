/* (c) Copyright Frontify Ltd., all rights reserved. */

import { builtinModules } from 'node:module';
import { resolve } from 'node:path';

import { defineConfig } from 'vitest/config';

import { dependencies as dependenciesMap } from './package.json';

const dependencies = Object.keys(dependenciesMap);

export default defineConfig({
    build: {
        target: 'node18',
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            fileName: () => '[name].mjs',
            name: 'FrontifyCli',
        },
        sourcemap: true,
        minify: true,
        rollupOptions: {
            external: [...dependencies, ...builtinModules, ...builtinModules.map((m) => `node:${m}`)],
            output: [
                {
                    format: 'es',
                    banner: '#!/usr/bin/env node\n',
                },
            ],
        },
    },
    test: {
        coverage: {
            enabled: true,
            provider: 'v8',
            reporter: ['text', 'lcov'],
            include: ['src/**/*.ts', 'src/**/*.tsx'],
        },
    },
});
