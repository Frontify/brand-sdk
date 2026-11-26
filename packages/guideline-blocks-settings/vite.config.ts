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

const RICH_TEXT_EDITOR_STYLES_NAME = 'richTextEditor/styles.css';
const RICH_TEXT_EDITOR_STYLES_FILE = 'rich-text-editor.css';

const assetFileNames = (chunkInfo: PreRenderedAsset): string => {
    if (chunkInfo.name === RICH_TEXT_EDITOR_STYLES_NAME) {
        return RICH_TEXT_EDITOR_STYLES_FILE;
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
            entry: {
                index: resolve(import.meta.dirname, 'src/index.ts'),
                'rich-text-editor': resolve(import.meta.dirname, 'src/richTextEditor/index.ts'),
            },
            // ESM only: its dependencies, such as @frontify/fondue and @frontify/app-bridge, are ESM too.
            formats: ['es'],
            fileName: (format: string) => `[name].${format}.js`,
        },
        sourcemap: true,
        minify: true,
        // Each entry keeps its own CSS, so the root stylesheet does not carry the rich text editor's.
        cssCodeSplit: true,
        // Vite 8 defaults CSS minification to Lightning CSS, which re-adds vendor prefixes that are
        // already present in the bundled Fondue styles and grows dist/styles.css by ~20%.
        cssMinify: 'esbuild',
        rollupOptions: {
            external,
            output: {
                preserveModules: true,
                preserveModulesRoot: 'src',
                assetFileNames,
            },
        },
    },
    optimizeDeps: {
        exclude: ['@frontify/app-bridge'],
    },
});
