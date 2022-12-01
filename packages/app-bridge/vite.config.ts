/* (c) Copyright Frontify Ltd., all rights reserved. */

import { resolve } from 'path';
import dts from 'vite-plugin-dts';
import copy from 'rollup-plugin-copy';
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
        dts({ insertTypesEntry: true }),
        copy({
            targets: [{ src: './src/workers/upload.worker.js', dest: './dist' }],
            hook: 'writeBundle',
        }),
    ],
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            fileName: (format: string) => `[name].${format}.js`,
            name: 'AppBridge',
        },
        sourcemap: true,
        minify: true,
        rollupOptions: {
            external: [...dependencies, ...peerDependencies],
            output: [
                {
                    format: 'es',
                    preserveModules: true,
                    preserveModulesRoot: 'src',
                    globals,
                },
                {
                    format: 'umd',
                    globals,
                },
                {
                    format: 'cjs',
                    globals,
                },
            ],
        },
    },
    test: {
        environment: 'happy-dom',
        coverage: {
            all: true,
            reporter: ['text', 'lcov'],
            include: ['src/**/*.ts', 'src/**/*.tsx'],
            exclude: ['src/**/test.ts', 'src/**/test.tsx', 'src/**/spec.ts', 'src/**/spec.tsx'],
        },
        setupFiles: [resolve(__dirname, 'src/setupTests.ts')],
    },
});
