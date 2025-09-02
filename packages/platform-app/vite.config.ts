/* (c) Copyright Frontify Ltd., all rights reserved. */

import { resolve } from 'node:path';

import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { defineConfig } from 'vitest/config';

import { dependencies as dependenciesMap } from './package.json';

const dependencies = Object.keys(dependenciesMap);

export default defineConfig({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    plugins: [react(), dts({ insertTypesEntry: true, rollupTypes: true })],
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            fileName: (format: string) => `[name].${format}.js`,
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
            enabled: true,
            provider: 'v8',
            all: true,
            reporter: ['text', 'lcov'],
            include: ['src/**/*.ts', 'src/**/*.tsx'],
        },
    },
});
