import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import inject from '@rollup/plugin-inject';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import stdLibBrowser from 'node-stdlib-browser';
import { join, sep } from 'path';
import { OutputOptions, RollupOptions } from 'rollup';
import combine from 'rollup-plugin-combine';
import esbuild from 'rollup-plugin-esbuild';
import postcss from 'rollup-plugin-postcss';
import { reactiveJson } from './reactiveJson';

const getEscapedMultiInputPaths = (projectPath: string, entryFileNames: string[]) =>
    entryFileNames.map((entryFileName) => {
        const paths = join(projectPath, entryFileName);
        if (process.platform === 'win32') {
            return paths.split(sep).join(`\\${sep}`);
        }

        return paths;
    });

export const getRollupConfig = (
    projectPath: string,
    entryFileNames: string[],
    env: Record<string, string>
): RollupOptions => {
    const external = ['react', 'react-dom'];
    const packageJson = reactiveJson<{ dependencies: Record<string, string> }>(join(projectPath, 'package.json'));
    const dependencies = Object.keys(packageJson.dependencies);

    return {
        external,
        treeshake: { moduleSideEffects: false },
        input: getEscapedMultiInputPaths(projectPath, entryFileNames),
        plugins: [
            alias({
                entries: stdLibBrowser,
            }),
            nodeResolve({
                extensions: ['.js', '.ts', '.tsx', '.json'],
                browser: true,
            }),
            commonjs(),
            combine({
                exports: 'named',
            }),
            replace({
                preventAssignment: true,
                values: {
                    ...Object.keys(env || []).reduce((stack, key) => {
                        stack[`process.env.${key}`] = JSON.stringify(env?.[key] || 'null');
                        return stack;
                    }, {}),
                },
            }),
            json(),
            inject({
                process: stdLibBrowser.process,
                Buffer: [stdLibBrowser.buffer, 'Buffer'],
            }),
            esbuild({
                sourceMap: true,
                minify: env['NODE_ENV'] === 'production',
                tsconfig: join(projectPath, 'tsconfig.json'),
                optimizeDeps: {
                    cwd: projectPath,
                    include: dependencies.filter((dep) => !external.includes(dep)),
                },
            }),
            postcss({
                config: {
                    path: join(projectPath, 'postcss.config.js'),
                    ctx: {},
                },
                minimize: env['NODE_ENV'] === 'production',
            }),
        ],
        onwarn: (warning) => {
            //TODO: Remove the silent: https://github.com/egoist/rollup-plugin-esbuild/issues/295
            if (warning.code && !['THIS_IS_UNDEFINED', 'CIRCULAR_DEPENDENCY'].includes(warning.code)) {
                console.error(warning.message);
            }
        },
    };
};

export const getOutputConfig = (distPath: string, iifeGlobalName: string): OutputOptions => ({
    dir: distPath,
    format: 'iife',
    name: iifeGlobalName,
    extend: true,
    globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
    },
    banner: `
            if (!window.global) {
                window.global = window;
            }
            window.require = (moduleName) => {
                switch (moduleName) {
                    case "react":
                        return window["React"];
                    case "react-dom":
                        return window["ReactDOM"];
                    default:
                        throw new Error("Could not resolve module from Frontify, please install it locally: npm i", moduleName);
                }
            };
        `,
});
