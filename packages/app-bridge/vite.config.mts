/* (c) Copyright Frontify Ltd., all rights reserved. */

import dts from 'vite-plugin-dts';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { defineConfig } from 'vitest/config';

import { dependencies as dependenciesMap, peerDependencies as peerDependenciesMap } from './package.json';

const dependencies = Object.keys(dependenciesMap);
const peerDependencies = Object.keys(peerDependenciesMap);

export default defineConfig({
    plugins: [
        dts({ insertTypesEntry: true, rollupTypes: true }),
        viteStaticCopy({
            targets: [{ src: './src/workers/upload.worker.js', dest: '.' }],
        }),
    ],
    build: {
        lib: {
            entry: {
                index: './src/index.ts',
                testing: './src/tests/index.ts',
            },
        },
        sourcemap: true,
        minify: true,
        rollupOptions: {
            external: [...dependencies, ...peerDependencies],
        },
    },
    test: {
        environment: 'happy-dom',
        css: true,
        coverage: {
            enabled: true,
            provider: 'v8',
            all: true,
            reporter: ['text', 'lcov'],
            include: ['src/**/*.ts', 'src/**/*.tsx'],
            exclude: ['src/**/test.ts', 'src/**/test.tsx', 'src/**/spec.ts', 'src/**/spec.tsx'],
        },
        setupFiles: ['./src/setupTests.ts'],
    },
});
