/* (c) Copyright Frontify Ltd., all rights reserved. */

import { defineConfig } from 'vitest/config';
import { PreRenderedAsset } from 'rollup';
import { dependencies as dependenciesMap, peerDependencies as peerDependenciesMap } from './package.json';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

const dependencies = Object.keys(dependenciesMap);
const peerDependencies = Object.keys(peerDependenciesMap);

export const globals = {
    react: 'React',
    'react-dom': 'ReactDOM',
};

const assetFileNames = (chunkInfo: PreRenderedAsset): string => {
    if (chunkInfo.name === 'style.css') {
        return 'styles.css';
    }
    return chunkInfo.name ?? 'UnknownFileName';
};

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
            external: [...dependencies, ...peerDependencies],
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
