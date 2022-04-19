import { nodeResolve } from '@rollup/plugin-node-resolve';
import esbuild from 'rollup-plugin-esbuild';
import commonJs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import pkg from './package.json';

export default {
    input: 'src/index.ts',
    external: [...Object.keys(pkg.dependencies || {}), 'fsevents'],
    plugins: [
        nodeResolve({ preferBuiltins: true }),
        commonJs(),
        json(),
        esbuild({
            minify: process.env.NODE_ENV === 'production',
            loaders: {
                '.json': 'json',
            },
        }),
    ],
    output: [
        {
            file: 'dist/index.js',
            format: 'cjs',
            sourcemap: true,
            banner: '#!/usr/bin/env node\n',
        },
    ],
};
