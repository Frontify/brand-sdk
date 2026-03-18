/* (c) Copyright Frontify Ltd., all rights reserved. */

import react from '@vitejs/plugin-react';
import { transform } from 'esbuild';
import { build } from 'vite';
import { viteExternalsPlugin } from 'vite-plugin-externals';

import { getAppBridgeVersion } from '../appBridgeVersion';

import { type CompilerOptions } from './compilerOptions';

export const compileBlock = async ({ projectPath, entryFile, outputName }: CompilerOptions) => {
    const appBridgeVersion = getAppBridgeVersion(projectPath);
    return build({
        plugins: [
            {
                name: 'stub-test-modules',
                enforce: 'pre',
                resolveId(id) {
                    if (id === 'sinon') {
                        return { id: '\0stub:sinon', syntheticNamedExports: true };
                    }
                },
                load(id) {
                    if (id.startsWith('\0stub:')) {
                        return 'export default {};';
                    }
                },
            },
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
                        renderChunk(code, chunk) {
                            if (chunk.exports.length > 0) {
                                return {
                                    code: `${code}\nwindow.${outputName} = {};\nwindow.${outputName}.dependencies = {};\nwindow.${outputName}.dependencies['@frontify/app-bridge'] = '${appBridgeVersion}';\n`,
                                    map: null,
                                };
                            }
                            return null;
                        },
                    },
                    {
                        name: 'minify',
                        renderChunk: {
                            order: 'post' as const,
                            async handler(code) {
                                return await transform(code, { minify: true });
                            },
                        },
                    },
                ],
                external: ['react', 'react-dom'],
            },
        },
    });
};
