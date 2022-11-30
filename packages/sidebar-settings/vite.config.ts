/* (c) Copyright Frontify Ltd., all rights reserved. */

import { defineConfig } from 'vitest/config';
import { dependencies as dependenciesMap } from './package.json';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

const dependencies = Object.keys(dependenciesMap);

export default defineConfig({
    plugins: [dts({ insertTypesEntry: true, rollupTypes: true })],
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            fileName: (format: string) => `[name].${format}.js`,
            name: 'GuidelineBlocksSettings',
        },
        sourcemap: true,
        minify: true,
        rollupOptions: {
            external: [...dependencies],
            output: [
                {
                    format: 'es',
                    preserveModules: true,
                    preserveModulesRoot: 'src',
                },
                {
                    format: 'umd',
                },
                {
                    format: 'cjs',
                },
            ],
        },
    },
});
