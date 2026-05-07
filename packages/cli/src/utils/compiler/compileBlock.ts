/* (c) Copyright Frontify Ltd., all rights reserved. */

import react from '@vitejs/plugin-react';
import { build, esmExternalRequirePlugin, type InlineConfig } from 'vite';

import { Logger } from '../logger';
import { REACT_MODULES } from '../vitePlugins';

import { type CompilerOptions } from './compilerOptions';

const isLightningCssError = (error: unknown): boolean => {
    const err = error as { message?: unknown; stack?: unknown } | null | undefined;
    const text = `${typeof err?.message === 'string' ? err.message : ''} ${
        typeof err?.stack === 'string' ? err.stack : ''
    }`.toLowerCase();
    return text.includes('lightningcss');
};

export const compileBlock = async ({ projectPath, entryFile, outputName }: CompilerOptions) => {
    const buildConfig = (cssMinify: 'lightningcss' | 'esbuild'): InlineConfig => ({
        plugins: [react(), esmExternalRequirePlugin({ external: REACT_MODULES })],
        define: {
            'process.env.NODE_ENV': JSON.stringify('production'),
        },
        root: projectPath,
        mode: 'production',
        build: {
            minify: 'terser',
            cssMinify,
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

    try {
        return await build(buildConfig('lightningcss'));
    } catch (error) {
        if (!isLightningCssError(error)) {
            throw error;
        }
        Logger.info('lightningcss minification failed (often caused by Fondue v12 CSS). Falling back to esbuild.');
        return build(buildConfig('esbuild'));
    }
};
