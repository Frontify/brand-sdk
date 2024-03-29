/* (c) Copyright Frontify Ltd., all rights reserved. */

import { defineConfig } from 'vitest/config';
import { dependencies as dependenciesMap } from './package.json';
import { resolve } from 'node:path';
import { builtinModules } from 'node:module';

const dependencies = Object.keys(dependenciesMap);

export default defineConfig({
    build: {
        target: 'node16',
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
            all: true,
            reporter: ['text', 'lcov'],
            include: ['src/**/*.ts', 'src/**/*.tsx'],
        },
    },
});
