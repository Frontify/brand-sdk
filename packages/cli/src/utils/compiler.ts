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

export const compilePlatformApp = async ({ outputName, projectPath = '' }: CompilerOptions) => {
    const getHash = (text) => createHash('sha256').update(text).digest('hex');
    const htmlHashPlugin = {
        name: 'html-hash',
        enforce: 'post',
        transformIndexHtml(html, { bundle }) {
            const linkTag = `${outputName}.${getHash(bundle['index.css'].source)}.css`;
            const scriptTag = `${outputName}.${getHash(bundle['index.js'].code)}.js`;

            html = html.replace('index.css', linkTag);
            html = html.replace('index.js', scriptTag);
            return html;
        },
        generateBundle(options, bundle) {
            bundle['index.html'].fileName = `${outputName}.${getHash(bundle['index.html'].source)}.html`;
            bundle['index.css'].fileName = `${outputName}.${getHash(bundle['index.css'].source)}.css`;
            bundle['index.js'].fileName = `${outputName}.${getHash(bundle['index.js'].code)}.js`;
        },
    };

    return build({
        plugins: [
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            react(),
            htmlHashPlugin,
        ],
        root: projectPath,
        build: {
            rollupOptions: {
                output: {
                    assetFileNames: () => '[name][extname]',
                    chunkFileNames: '[name].js',
                    entryFileNames: '[name].js',
                },
            },
        },
    });
};
