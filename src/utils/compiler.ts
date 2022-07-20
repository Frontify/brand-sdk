/* (c) Copyright Frontify Ltd., all rights reserved. */

import { join } from 'path';
import { InlineConfig } from 'vite';

const filesToIgnore = ['node_modules', 'package*.json', '.git', '.gitignore', 'dist'];

export const getViteConfig = (
    projectPath: string,
    entryFile: string,
    mode: InlineConfig['mode'],
    outputName: string,
    watch = false
): InlineConfig => {
    const config: InlineConfig = {
        mode,
        envDir: join(__dirname, 'env'),
        root: projectPath,
        logLevel: 'warn',
        build: {
            lib: {
                name: outputName,
                entry: entryFile,
                formats: ['iife'],
                fileName: () => 'index.js',
            },

            watch: watch
                ? {
                      include: `${projectPath}/**`,
                      exclude: filesToIgnore,
                  }
                : null,
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
    };

    return config;
};
