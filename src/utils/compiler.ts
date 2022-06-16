import { BuildOptions } from 'esbuild';
import { join, sep } from 'path';
import { OutputOptions } from 'rollup';
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
): BuildOptions => {
    const external = ['react', 'react-dom'];
    const packageJson = reactiveJson<{ dependencies: Record<string, string> }>(join(projectPath, 'package.json'));
    const dependencies = Object.keys(packageJson.dependencies);
    console.log('root', join(projectPath, 'src/index.tsx'));

    return {
        format: 'iife',
        minify: false,
        bundle: true,
        entryPoints: [join(projectPath, 'src', 'index.tsx')],
        outdir: join(projectPath, 'dist'),
        banner: {
            js: `
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
        },
        globalName: '_contentScriptReturn',
        footer: { js: '_contentScriptReturn.default' }, // this allows the default export to be returned to global scope
    };

    // return {
    //     external,
    //     treeshake: env['NODE_ENV'] === 'production',
    //     input: getEscapedMultiInputPaths(projectPath, entryFileNames),
    //     plugins: [
    //         alias({
    //             entries: stdLibBrowser,
    //         }),
    //         nodeResolve({
    //             extensions: ['.js', '.ts', '.tsx', '.json'],
    //             browser: true,
    //         }),
    //         commonjs(),
    //         combine({
    //             exports: 'named',
    //         }),
    //         replace({
    //             preventAssignment: true,
    //             values: {
    //                 ...Object.keys(env || []).reduce((stack, key) => {
    //                     stack[`process.env.${key}`] = JSON.stringify(env?.[key] || 'null');
    //                     return stack;
    //                 }, {}),
    //             },
    //         }),
    //         json(),
    //         inject({
    //             process: stdLibBrowser.process,
    //             Buffer: [stdLibBrowser.buffer, 'Buffer'],
    //         }),
    //         esbuild({
    // sourceMap: true,
    // minify: env['NODE_ENV'] === 'production',
    // tsconfig: join(projectPath, 'tsconfig.json'),
    // optimizeDeps: {
    //     cwd: projectPath,
    //     include: dependencies.filter((dep) => !external.includes(dep)),
    // },
    //         }),
    //         postcss({
    //             config: {
    //                 path: join(projectPath, 'postcss.config.js'),
    //                 ctx: {},
    //             },
    //             minimize: env['NODE_ENV'] === 'production',
    //         }),
    //     ],
    //     onwarn: (warning) => {
    //         //TODO: Remove the silent: https://github.com/egoist/rollup-plugin-esbuild/issues/295
    //         if (warning.code && !['THIS_IS_UNDEFINED', 'CIRCULAR_DEPENDENCY'].includes(warning.code)) {
    //             console.error(warning.message);
    //         }
    //     },
    // };
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
