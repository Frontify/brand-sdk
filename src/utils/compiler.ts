/* (c) Copyright Frontify Ltd., all rights reserved. */

import { join } from 'path';
import { InlineConfig, build } from 'vite';
import react from '@vitejs/plugin-react';
import { viteExternalsPlugin } from 'vite-plugin-externals';

const filesToIgnore = ['node_modules', 'package*.json', '.git', '.gitignore', 'dist'];

// const reactWindowPlugin = {
//     name: 'reactWindow',
//     setup(build) {
//         // Intercept import paths called "env" so esbuild doesn't attempt
//         // to map them to a file system location. Tag them with the "env-ns"
//         // namespace to reserve them for this plugin.
//         build.onResolve({ filter: /^react$/ }, (args) => ({
//             path: args.path,
//             namespace: 'globalExternal',
//         }));

//         // Load paths tagged with the "env-ns" namespace and behave as if
//         // they point to a JSON file containing the environment variables.
//         build.onLoad({ filter: /.*/, namespace: 'globalExternal' }, () => ({
//             contents: 'module.exports = globalThis.React',
//             loader: 'js',
//         }));
//     },
// };

export const compile = async (
    projectPath: string,
    entryFile: string,
    mode: InlineConfig['mode'],
    outputName: string
) => {
    return build({
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
};
