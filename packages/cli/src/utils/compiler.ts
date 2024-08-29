/* (c) Copyright Frontify Ltd., all rights reserved. */

import react from '@vitejs/plugin-react';
import { build } from 'vite';
import { viteExternalsPlugin } from 'vite-plugin-externals';

import { getAppBridgeThemeVersion } from './appBridgeThemeVersion';
import { getAppBridgeVersion } from './appBridgeVersion';

export type CompilerOptions = {
    projectPath: string;
    entryFile: string;
    outputName: string;
};

export const compileTheme = async ({ projectPath, entryFile, outputName }: CompilerOptions) => {
    const appBridgeVersion = getAppBridgeThemeVersion(projectPath);
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
                        window.${outputName}.dependencies['@frontify/app-bridge-theme'] = '${appBridgeVersion}';
                    `,
                },
            },
        },
    });
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
    const appBridgeVersion = getAppBridgeVersion(projectPath);

    const settings = await build({
        plugins: [
            react(),
            viteExternalsPlugin({
                react: 'React',
                'react-dom': 'ReactDOM',
            }),
        ],
        root: projectPath,
        define: {
            'process.env.NODE_ENV': JSON.stringify('production'),
        },
        build: {
            lib: {
                entry: entryFile,
                name: outputName,
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
                    entryFileNames: 'settings.js',
                    footer: `
                        window.${outputName} = ${outputName};
                        window.${outputName}.dependencies = window.${outputName}.packages || {};
                        window.${outputName}.dependencies['@frontify/app-bridge'] = '${appBridgeVersion}';
                    `,
                },
            },
        },
    });

    const app = await build({
        plugins: [react()],
        root: projectPath,
        define: {
            'process.env.NODE_ENV': JSON.stringify('production'),
        },
        base: '/__DYNAMIC_SEGMENT__/',
        build: {
            emptyOutDir: false,
        },
    });
    return { app, settings };
};
