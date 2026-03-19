/* (c) Copyright Frontify Ltd., all rights reserved. */

import react from '@vitejs/plugin-react';
import { build } from 'vite';
import { viteExternalsPlugin } from 'vite-plugin-externals';

import { getAppBridgeVersion } from '../appBridgeVersion';

import { type CompilerOptions } from './compilerOptions';
import { stubSinon } from './plugins/stubSinon';

export const compileBlock = async ({ projectPath, entryFile, outputName }: CompilerOptions) => {
    const appBridgeVersion = getAppBridgeVersion(projectPath);
    return build({
        plugins: [
            stubSinon(),
            react(),
            viteExternalsPlugin({
                react: 'React',
                'react-dom': 'ReactDOM',
            }),
        ],
        define: {
            'process.env.NODE_ENV': JSON.stringify('production'),
        },
        root: projectPath,
        build: {
            lib: {
                entry: entryFile,
                formats: ['es'],
                fileName: () => 'index.js',
            },
            cssMinify: 'esbuild',
            rolldownOptions: {
                plugins: [
                    {
                        name: 'exports-to-window',
                        renderChunk(code, chunk) {
                            if (chunk.exports.length > 0) {
                                return {
                                    code: `${code}\nwindow.${outputName} = {};\nwindow.${outputName}.dependencies = {};\nwindow.${outputName}.dependencies['@frontify/app-bridge'] = '${appBridgeVersion}';\n`,
                                    map: null,
                                    moduleType: 'js',
                                };
                            }
                            return null;
                        },
                    },
                ],
                external: ['react', 'react-dom'],
                output: {
                    minify: true,
                },
            },
        },
    });
};
