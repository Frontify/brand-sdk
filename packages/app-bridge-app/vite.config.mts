/* (c) Copyright Frontify Ltd., all rights reserved. */

import dts from 'vite-plugin-dts';
import { defineConfig } from 'vitest/config';

import { peerDependencies as peerDependenciesMap } from './package.json';

const peerDependencies = Object.keys(peerDependenciesMap);

export default defineConfig({
    plugins: [dts({ insertTypesEntry: true, rollupTypes: true })],
    build: {
        lib: {
            entry: {
                index: './src/index.ts',
            },
            name: 'app-bridge-app',
        },
        sourcemap: true,
        minify: true,
        rollupOptions: {
            external: [...peerDependencies],
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
