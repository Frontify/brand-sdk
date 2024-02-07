/* (c) Copyright Frontify Ltd., all rights reserved. */

import react from '@vitejs/plugin-react';
import { PluginOption, build } from 'vite';
import { viteExternalsPlugin } from 'vite-plugin-externals';
import { createHash } from 'crypto';
import { getAppBridgeVersion } from './appBridgeVersion.js';
import { renameSync, rmSync } from 'fs';

export type CompilerOptions = {
    projectPath: string;
    entryFile: string;
    outputName: string;
};

export const compileBlock = async ({ projectPath, entryFile, outputName }: CompilerOptions) => {
    const appBridgeVersion = getAppBridgeVersion(projectPath);
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
                    footer: `
                        window.${outputName} = ${outputName};
                        window.${outputName}.dependencies = window.${outputName}.packages || {};
                        window.${outputName}.dependencies['@frontify/app-bridge'] = '${appBridgeVersion}';
                    `,
                },
            },
        },
    });
};

export const compilePlatformApp = async ({ outputName, entryFile, projectPath = '' }: CompilerOptions) => {
    let settingsHashName = '';
    const getHash = (text) => createHash('sha256').update(text).digest('hex');

    const htmlHashPlugin: PluginOption = {
        name: 'html-hash',
        enforce: 'post',
        transformIndexHtml(html, { bundle }) {
            const indexJsSource = bundle?.['index.js'].type === 'chunk' ? bundle?.['index.js'].code : null;
            const indexCssSource = bundle?.['index.css'].type === 'asset' ? bundle?.['index.css'].source : null;

            const cssFileName = `${outputName}.${getHash(indexCssSource)}.css`;
            const jsFileName = `${outputName}.${getHash(indexJsSource)}.js`;

            html = html.replace('index.css', cssFileName).replace('index.js', jsFileName);
            return html;
        },
        generateBundle(_options, bundle) {
            const indexHtmlSource = bundle?.['index.html'].type === 'asset' ? bundle?.['index.html'].source : null;
            const indexJsSource = bundle?.['index.js'].type === 'chunk' ? bundle?.['index.js'].code : null;
            const indexCssSource = bundle?.['index.css'].type === 'asset' ? bundle?.['index.css'].source : null;

            bundle['index.html'].fileName = `${outputName}.${getHash(indexHtmlSource)}.html`;
            bundle['index.js'].fileName = `${outputName}.${getHash(indexJsSource)}.js`;
            bundle['index.css'].fileName = `${outputName}.${getHash(indexCssSource)}.css`;
        },
    };

    const jsHashPlugin: PluginOption = {
        name: 'js-hash',
        enforce: 'post',
        generateBundle(_options, bundle) {
            const indexJsSource = bundle?.['index.js'].type === 'chunk' ? bundle?.['index.js'].code : null;
            settingsHashName = `settings-${outputName}.${getHash(indexJsSource)}.js`;
            bundle['index.js'].fileName = settingsHashName;
        },
    };

    await build({
        plugins: [jsHashPlugin],
        define: {
            'process.env.NODE_ENV': JSON.stringify('production'),
        },
        build: {
            lib: {
                entry: entryFile,
                name: 'Settings',
                formats: ['es'],
            },
            rollupOptions: {
                output: {
                    dir: 'temp',
                    assetFileNames: () => '[name][extname]',
                    chunkFileNames: '[name].js',
                    entryFileNames: '[name].js',
                },
                external: ['app'],
            },
        },
    });

    await build({
        plugins: [react(), htmlHashPlugin],
        root: projectPath,
        define: {
            'process.env.NODE_ENV': JSON.stringify('production'),
        },
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

    // move and cleanup
    try {
        renameSync(`temp/${settingsHashName}`, `dist/${settingsHashName}`);
        rmSync('temp', { recursive: true, force: true });
    } catch (error) {
        console.log('error to rename');
        throw error;
    }
};
