/* (c) Copyright Frontify Ltd., all rights reserved. */

import { defineConfig } from 'vitest/config';
import { dependencies as dependenciesMap } from './package.json';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

const dependencies = Object.keys(dependenciesMap);

export default defineConfig({
    plugins: [dts({ insertTypesEntry: true, rollupTypes: true })],
    resolve: {
        mainFields: ['module', 'main'],
    },
    test: {
        environment: 'happy-dom',
        deps: {
            inline: ['clsx', '@juggle/resize-observer'],
        },
        setupFiles: ['setupTests.ts'],
    },
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
                    name: 'GuidelineBlocksSettings',
                    format: 'es',
                    preserveModules: true,
                    preserveModulesRoot: 'src',
                },
                {
                    name: 'GuidelineBlocksSettings',
                    format: 'umd',
                },
                {
                    name: 'GuidelineBlocksSettings',
                    format: 'cjs',
                },
            ],
        },
    },
});
