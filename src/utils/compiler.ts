/* (c) Copyright Frontify Ltd., all rights reserved. */

import { join } from 'path';
import { InlineConfig } from 'vite';
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
        plugins: [
            react(),
            viteExternalsPlugin({
                react: 'React',
                'react-dom': 'ReactDOM',
            }),
        ],

        logLevel: 'info',
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
