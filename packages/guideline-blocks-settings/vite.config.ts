/* (c) Copyright Frontify Ltd., all rights reserved. */

import { resolve } from 'node:path';

import react from '@vitejs/plugin-react';
import { type PreRenderedAsset } from 'rollup';
import dts from 'vite-plugin-dts';
import { defineConfig } from 'vitest/config';

import packageJson from './package.json' with { type: 'json' };

// Externalize every declared dependency and any of its subpaths (e.g. '@frontify/fondue/rte').
const external = [...Object.keys(packageJson.dependencies), ...Object.keys(packageJson.peerDependencies)].map(
    (dependency) => new RegExp(`^${dependency.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(/.*)?$`),
);

export const globals = {
    react: 'React',
    'react-dom': 'ReactDOM',
    'react-dom/client': 'ReactDOM',
};

const assetFileNames = (chunkInfo: PreRenderedAsset): string => {
    if (chunkInfo.name === 'guideline-blocks-settings.css') {
        return 'styles.css';
    }
    return chunkInfo.name ?? 'UnknownFileName';
};

export default defineConfig({
    plugins: [dts({ insertTypesEntry: true, bundleTypes: true }), react()],
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
            entry: resolve(import.meta.dirname, 'src/index.ts'),
            fileName: (format: string) => `[name].${format}.js`,
        },
        sourcemap: true,
        minify: true,
        // Vite 8 defaults CSS minification to Lightning CSS, which re-adds vendor prefixes that are
        // already present in the bundled Fondue styles and grows dist/styles.css by ~20%.
        cssMinify: 'esbuild',
        rollupOptions: {
            external,
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
    optimizeDeps: {
        exclude: ['@frontify/app-bridge'],
    },
});
