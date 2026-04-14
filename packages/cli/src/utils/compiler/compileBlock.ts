/* (c) Copyright Frontify Ltd., all rights reserved. */

import react from '@vitejs/plugin-react';
import { build, esmExternalRequirePlugin } from 'vite';

import { REACT_MODULES } from '../vitePlugins';

import { type CompilerOptions } from './compilerOptions';

export const compileBlock = async ({ projectPath, entryFile, outputName }: CompilerOptions) => {
    return build({
        plugins: [react(), esmExternalRequirePlugin({ external: REACT_MODULES })],
        define: {
            'process.env.NODE_ENV': JSON.stringify('production'),
        },
        root: projectPath,
        mode: 'production',
        build: {
            minify: 'terser',
            cssMinify: 'lightningcss',
            lib: {
                name: outputName,
                entry: entryFile,
                formats: ['es'],
                fileName: () => 'index.js',
                cssFileName: 'style',
            },
            rolldownOptions: {
                platform: 'browser',
                treeshake: {
                    // TODO: Fix in Fondue
                    moduleSideEffects: [
                        { test: /@frontify\/fondue-components/, sideEffects: false },
                        { test: /@frontify\/fondue-icons/, sideEffects: false },
                        { test: /@frontify\/fondue-tokens/, sideEffects: false },
                        { test: /@frontify\/fondue-charts/, sideEffects: false },
                        { test: /@frontify\/fondue-rte/, sideEffects: false },
                        { test: /\.css$/, sideEffects: true },
                    ],
                },
            },
        },
    });
};
