/* (c) Copyright Frontify Ltd., all rights reserved. */

import { join } from 'path';
import { InlineConfig } from 'vite';
import react from '@vitejs/plugin-react';

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
        plugins: [react()],

        // logLevel: 'warn',
        build: {
            // polyfillModulePreload: false,
            lib: {
                name: outputName,
                entry: entryFile,
                formats: ['es'],
                fileName: () => '[name].[hash].js',
            },

            // watch: watch
            //     ? {
            //           include: `${projectPath}/**`,
            //           exclude: filesToIgnore,
            //       }
            //     : null,
            rollupOptions: {
                external: ['react', 'react-dom'],
                input: entryFile,
                output: {
                    globals: {
                        react: 'React',
                        'react-dom': 'ReactDOM',
                    },
                    // footer: `window.${outputName} = ${outputName};`,
                },
            },
        },
    };

    return config;
};
