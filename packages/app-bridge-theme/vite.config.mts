/* (c) Copyright Frontify Ltd., all rights reserved. */

import dts from 'vite-plugin-dts';
import { defineConfig } from 'vitest/config';

import { dependencies as dependenciesMap, peerDependencies as peerDependenciesMap } from './package.json';

const dependencies = Object.keys(dependenciesMap);
const peerDependencies = Object.keys(peerDependenciesMap);

export const globals = {
    react: 'React',
    'react-dom': 'ReactDOM',
};

export default defineConfig({
    plugins: [
        dts({ insertTypesEntry: true, rollupTypes: true }),
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
        css: true,
        coverage: {
            all: true,
            reporter: ['text', 'lcov'],
            include: ['src/**/*.ts', 'src/**/*.tsx'],
            exclude: ['src/**/spec.ts', 'src/**/spec.tsx'],
        },
        setupFiles: ['./src/setupTests.ts'],
    },
});
