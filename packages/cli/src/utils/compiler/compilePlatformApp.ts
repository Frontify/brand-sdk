/* (c) Copyright Frontify Ltd., all rights reserved. */

import react from '@vitejs/plugin-react';
import { build } from 'vite';
import { viteExternalsPlugin } from 'vite-plugin-externals';

import { getAppBridgeVersion } from '../getPackageVersion';
import { isPackageProtocolSpecifier } from '../packageProtocols';

import { type CompilerOptions } from './compilerOptions';

const isValidVersion = (version: string | undefined): version is string => {
    return version !== undefined && !isPackageProtocolSpecifier(version);
};

export const compilePlatformApp = async ({ outputName, entryFile, projectPath = '' }: CompilerOptions) => {
    const appBridgeVersion = getAppBridgeVersion(projectPath);
    const safeAppBridgeVersion = isValidVersion(appBridgeVersion) ? appBridgeVersion : undefined;

    const settings = await build({
        plugins: [
            react(),
            viteExternalsPlugin({
                react: 'React',
                'react-dom': 'ReactDOM',
            }),
        ],
        root: projectPath,
        mode: 'production',
        define: {
            'process.env.NODE_ENV': JSON.stringify('production'),
        },
        build: {
            minify: 'terser',
            cssMinify: 'esbuild',
            lib: {
                entry: entryFile,
                name: outputName,
                formats: ['iife'],
                fileName: () => 'index.js',
                cssFileName: 'style',
            },
            rollupOptions: {
                external: ['react', 'react-dom'],
                output: {
                    globals: {
                        react: 'React',
                        'react-dom': 'ReactDOM',
                    },
                    entryFileNames: 'settings.js',
                    footer: `
                        window.${outputName} = ${outputName};
                        window.${outputName}.dependencies = window.${outputName}.packages || {};
                        ${safeAppBridgeVersion ? `window.${outputName}.dependencies['@frontify/app-bridge-app'] = '${safeAppBridgeVersion}';` : ''}
                    `,
                },
            },
        },
    });

    const app = await build({
        plugins: [react()],
        root: projectPath,
        mode: 'production',
        define: {
            'process.env.NODE_ENV': JSON.stringify('production'),
        },
        base: '/__DYNAMIC_SEGMENT__/',
        build: {
            minify: 'terser',
            cssMinify: 'esbuild',
            emptyOutDir: false,
        },
    });
    return { app, settings };
};
