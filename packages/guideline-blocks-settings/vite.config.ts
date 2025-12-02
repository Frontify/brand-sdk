/* (c) Copyright Frontify Ltd., all rights reserved. */

import { resolve } from 'node:path';

import react from '@vitejs/plugin-react';
import { type PreRenderedAsset } from 'rollup';
import dts from 'vite-plugin-dts';
import { defineConfig } from 'vitest/config';

import { dependencies as dependenciesMap, peerDependencies as peerDependenciesMap } from './package.json';

const dependencies = Object.keys(dependenciesMap);
const peerDependencies = Object.keys(peerDependenciesMap);

export const globals = {
    react: 'React',
    'react-dom': 'ReactDOM',
    'react-dom/client': 'ReactDOM',
};

const assetFileNames = (chunkInfo: PreRenderedAsset): string => {
    if (chunkInfo.name === 'style.css') {
        return 'styles.css';
    }
    return chunkInfo.name ?? 'UnknownFileName';
};

export default defineConfig({
    plugins: [dts({ insertTypesEntry: true, rollupTypes: true }), react()],
    resolve: {
        mainFields: ['module', 'main'],
    },
    test: {
        setupFiles: ['setupTests.ts'],
        environment: 'happy-dom',
        server: {
            deps: {
                inline: ['clsx', '@juggle/resize-observer'],
            },
        },
    },
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            fileName: (format: string) => `[name].${format}.js`,
        },
        sourcemap: true,
        minify: true,
        rollupOptions: {
            external: [...dependencies, ...peerDependencies, 'react-dom/client', 'react/jsx-runtime', /^vfile/],
            output: [
                {
                    name: 'GuidelineBlocksSettings',
                    format: 'es',
                    preserveModules: true,
                    preserveModulesRoot: 'src',
                    assetFileNames,
                    globals,
                },
                {
                    name: 'GuidelineBlocksSettings',
                    format: 'umd',
                    assetFileNames,
                    globals,
                },
                {
                    name: 'GuidelineBlocksSettings',
                    format: 'cjs',
                    assetFileNames,
                    globals,
                },
            ],
        },
    },
});
