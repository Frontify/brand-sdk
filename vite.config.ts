/* (c) Copyright Frontify Ltd., all rights reserved. */

import { defineConfig } from 'vitest/config';
import copy from 'rollup-plugin-copy';
import { dependencies as dependenciesMap } from './package.json';
import { resolve } from 'path';
import { builtinModules } from 'module';

const dependencies = Object.keys(dependenciesMap);

export default defineConfig({
    optimizeDeps: {
        exclude: builtinModules,
    },
    plugins: [
        copy({
            targets: [{ src: 'env', dest: 'dist' }],
            hook: 'writeBundle',
        }),
    ],
    define: {
        'process.env.NODE_ENV': '"production"',
    },
    build: {
        target: 'node16',
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            fileName: () => 'index.js',
            name: 'FrontifyCli',
        },
        sourcemap: true,
        minify: true,
        rollupOptions: {
            external: [...dependencies, ...builtinModules, ...builtinModules.map((m) => `node:${m}`)],
            output: [
                {
                    format: 'cjs',
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
