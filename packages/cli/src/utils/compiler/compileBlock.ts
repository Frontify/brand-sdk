/* (c) Copyright Frontify Ltd., all rights reserved. */

import react from '@vitejs/plugin-react';
import { build } from 'vite';
import { viteExternalsPlugin } from 'vite-plugin-externals';

import { getAppBridgeVersion } from '../appBridgeVersion';
import { getReactVersion } from '../reactVersion';

import { type CompilerOptions } from './compilerOptions';

export const compileBlock = async ({ projectPath, entryFile, outputName }: CompilerOptions) => {
    const appBridgeVersion = getAppBridgeVersion(projectPath);
    const reactVersion = getReactVersion(projectPath);
    return build({
        plugins: [
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
            rollupOptions: {
                plugins: [
                    {
                        name: 'exports-to-window',
                        generateBundle(_, bundle) {
                            for (const chunk of Object.values(bundle)) {
                                if (chunk.type === 'chunk' && chunk.exports.length > 0) {
                                    chunk.code += `\nwindow.${outputName} = {};\n`;
                                    chunk.code += `\nwindow.${outputName}.dependencies = {};\n`;
                                    chunk.code += `window.${outputName}.dependencies['@frontify/app-bridge'] = '${appBridgeVersion}';\n`;
                                    chunk.code += `window.${outputName}.dependencies['react'] = '${reactVersion}';\n`;
                                }
                            }
                        },
                    },
                ],
                external: ['react', 'react-dom'],
            },
        },
    });
};
