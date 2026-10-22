/* (c) Copyright Frontify Ltd., all rights reserved. */

import dts from 'vite-plugin-dts';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { defineConfig } from 'vitest/config';

import { dependencies as dependenciesMap, peerDependencies as peerDependenciesMap } from './package.json';

// Externalize every declared dependency and any of its subpaths (e.g. 'react/jsx-runtime').
const external = [...Object.keys(dependenciesMap), ...Object.keys(peerDependenciesMap)].map(
    (dependency) => new RegExp(`^${dependency.replaceAll(/[.*+?^${}()|[\]\\]/g, '\\$&')}(/.*)?$`),
);

export default defineConfig({
    plugins: [
        dts({ insertTypesEntry: true }),
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
            name: 'app-bridge',
        },
        sourcemap: true,
        minify: true,
        rollupOptions: {
            external,
            output: {
                // The inline worker builds its Blob when its module loads. In its own chunk, bundlers can drop it
                // (thanks to `sideEffects: false`) from apps that never upload.
                manualChunks: (id) => (id.includes('upload.worker.js?worker') ? 'inline-upload-worker' : undefined),
            },
        },
    },
    test: {
        environment: 'happy-dom',
        css: true,
        coverage: {
            enabled: true,
            provider: 'v8',
            reporter: ['text', 'lcov'],
            include: ['src/**/*.ts', 'src/**/*.tsx'],
            exclude: ['src/**/test.ts', 'src/**/test.tsx', 'src/**/spec.ts', 'src/**/spec.tsx'],
        },
        setupFiles: ['./src/setupTests.ts'],
    },
});
