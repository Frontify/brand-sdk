/* (c) Copyright Frontify Ltd., all rights reserved. */

import react from '@vitejs/plugin-react';
import { build } from 'vite';
import { viteExternalsPlugin } from 'vite-plugin-externals';
import { createHash } from 'crypto';

export type CompilerOptions = {
    projectPath: string;
    entryFile: string;
    outputName: string;
};
export const compileBlock = async ({ projectPath, entryFile, outputName }: CompilerOptions) =>
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

export const compilePlatformApp = async ({ outputName }: CompilerOptions) => {
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
        base: `/${outputName}`,

        plugins: [
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            react(),
            htmlHashPlugin,
        ],
        build: {
            rollupOptions: {
                output: {
                    assetFileNames: () => '[name]-[hash][extname]',
                    chunkFileNames: '[name]-[hash].js',
                    entryFileNames: '[name]-[hash].js',
                },
            },
        },
    });
};
