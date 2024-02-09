/* (c) Copyright Frontify Ltd., all rights reserved. */

import { defineConfig } from 'vitest/config';
import dts from 'vite-plugin-dts';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { dependencies as dependenciesMap } from './package.json';

const dependencies = Object.keys(dependenciesMap);

export default defineConfig({
    plugins: [react(), dts({ insertTypesEntry: true, rollupTypes: true })],
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
        },
        sourcemap: true,
        minify: true,
        rollupOptions: {
            external: [...dependencies],
            output: [
                {
                    name: 'PlatformApp',
                    format: 'es',
                    preserveModules: true,
                    preserveModulesRoot: 'src',
                },
                {
                    name: 'PlatformApp',
                    format: 'umd',
                },
                {
                    name: 'PlatformApp',
                    format: 'cjs',
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
