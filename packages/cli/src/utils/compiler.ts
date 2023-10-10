/* (c) Copyright Frontify Ltd., all rights reserved. */

import react from '@vitejs/plugin-react';
import { build } from 'vite';
import { viteExternalsPlugin } from 'vite-plugin-externals';
import { createHash } from 'crypto';
import { viteSingleFile } from 'vite-plugin-singlefile';

export const compile = async (projectPath: string, entryFile: string, outputName: string) =>
    build({
        plugins: [
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
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
                name: outputName,
                entry: entryFile,
                formats: ['iife'],
                fileName: () => 'index.js',
            },
            rollupOptions: {
                external: ['react', 'react-dom'],
                output: {
                    globals: {
                        react: 'React',
                        'react-dom': 'ReactDOM',
                    },
                    footer: `window.${outputName} = ${outputName};`,
                },
            },
        },
    });

export const compilePlatformApp = async (projectName: string, appId: string) => {
    const getHash = (text) => createHash('sha256').update(text).digest('hex').substring(0, 8);
    const htmlHashPlugin = {
        name: 'html-hash',
        enforce: 'post',
        generateBundle(options, bundle) {
            const indexHtml = bundle['index.html'];
            indexHtml.fileName = `index.${getHash(indexHtml.source)}.html`;
        },
    };

    return build({
        plugins: [
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            react(),
            htmlHashPlugin,
            viteSingleFile(),
        ],
    });
};
