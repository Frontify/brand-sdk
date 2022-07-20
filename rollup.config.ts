import { nodeResolve } from '@rollup/plugin-node-resolve';
import esbuild from 'rollup-plugin-esbuild';
import commonJs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import replace from '@rollup/plugin-replace';
import pkg from './package.json';
import copy from 'rollup-plugin-copy';

/** @type {import('rollup').RollupOptions} */
const rollupConfig = {
    input: 'src/index.ts',
    external: [...Object.keys(pkg.dependencies || {}), 'fsevents'],
    plugins: [
        nodeResolve({ preferBuiltins: true, exportConditions: ['node'] }),
        commonJs(),
        replace({
            preventAssignment: true,
            values: { 'process.env.NODE_ENV': JSON.stringify('production') },
        }),
        json(),
        esbuild({
            minify: process.env.NODE_ENV === 'production',
            loaders: {
                '.json': 'json',
            },
        }),
        copy({
            targets: [
                {
                    src: 'env',
                    dest: 'dist',
                },
            ],
        }),
    ],
    onwarn: (warning) => {
        //TODO: Remove the silent: https://github.com/egoist/rollup-plugin-esbuild/issues/295
        if (warning.code && 'CIRCULAR_DEPENDENCY' !== warning.code && !warning.message.includes('node:')) {
            console.error(warning.message);
        }
    },
    output: [
        {
            file: 'dist/index.js',
            format: 'cjs',
            sourcemap: true,
            banner: '#!/usr/bin/env node\n',
        },
    ],
};

export default rollupConfig;
