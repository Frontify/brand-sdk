import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import { join, resolve, sep } from 'path';
import { OutputOptions, RollupOptions, rollup } from 'rollup';
import combine from 'rollup-plugin-combine';
import esbuild from 'rollup-plugin-esbuild';
import postcss from 'rollup-plugin-postcss';
import { DefinePlugin, webpack } from 'webpack';
import CompilationFailedError from '../errors/CompilationFailedError';

export enum Bundler {
    Rollup = 'rollup',
    Webpack = 'webpack',
}
export interface CompilerOptions {
    distPath?: string;
    tsconfigPath?: string;
    env?: Record<string, string>;
    minify?: boolean;
    sourceMap?: boolean;
    treeshake?: boolean;
    bundler?: Bundler;
}

export const compile = async (
    projectPath: string,
    entryFileNames: string[],
    iifeGlobalName: string,
    options: CompilerOptions
): Promise<void> => {
    const defaultOptions: CompilerOptions = {
        distPath: 'dist',
        tsconfigPath: 'tsconfig.json',
        env: {},
        minify: true,
        sourceMap: true,
        treeshake: true,
        bundler: Bundler.Rollup,
    };

    const mergedOptions = {
        ...defaultOptions,
        ...options,
    };

    switch (mergedOptions.bundler) {
        case Bundler.Rollup:
            return rollupCompile(projectPath, entryFileNames, iifeGlobalName, mergedOptions);
        case Bundler.Webpack:
            return webpackCompile(projectPath, entryFileNames, iifeGlobalName, mergedOptions);
        default:
            throw new CompilationFailedError(
                `Invalid bundler provided, please use one of ${Object.keys(Bundler).join(', ')}`
            );
    }
};

const getEscapedMultiInputPaths = (projectPath: string, entryFileNames: string[]) =>
    entryFileNames.map((entryFileName) => {
        const paths = join(projectPath, entryFileName);
        if (process.platform === 'win32') {
            return paths.split(sep).join(`\\${sep}`);
        }

        return paths;
    });

const rollupCompile = async (
    projectPath: string,
    entryFileNames: string[],
    iifeGlobalName: string,
    options: CompilerOptions
) => {
    const rollupConfig: RollupOptions = {
        external: ['react', 'react-dom'],
        treeshake: options.treeshake,
        input: getEscapedMultiInputPaths(projectPath, entryFileNames),
        plugins: [
            combine({
                exports: 'named',
            }),
            replace({
                preventAssignment: true,
                values: {
                    ...Object.keys(options.env || []).reduce((stack, key) => {
                        stack[`process.env.${key}`] = JSON.stringify(options?.env?.[key] || 'null');
                        return stack;
                    }, {}),
                },
            }),
            nodeResolve({
                extensions: ['.js', '.ts', '.tsx', '.json'],
            }),
            json(),
            postcss({
                config: {
                    path: join(projectPath, 'postcss.config.js'),
                    ctx: {},
                },
                minimize: options.minify,
            }),
            esbuild({
                sourceMap: options.sourceMap,
                minify: options.minify,
                tsconfig: options.tsconfigPath,
                experimentalBundling: true,
            }),
        ],
    };

    const outputConfig: OutputOptions = {
        dir: options.distPath,
        format: 'iife',
        name: iifeGlobalName,
        globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
        },
        banner: `
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
    };

    try {
        const bundle = await rollup(rollupConfig);

        await bundle.write(outputConfig);

        await bundle.close();
    } catch (error) {
        throw new CompilationFailedError(error as string);
    }
};

const getWithoutFileExtension = (path: string) => path.slice(0, path.lastIndexOf('.'));

const getVirtualEntry = (entryFileNames: string[]): string => {
    const filePathMap = entryFileNames.map((filePath) => {
        const fileName = filePath.split('/').pop();
        if (!fileName) {
            throw new CompilationFailedError('No filename provided');
        }

        return {
            name: getWithoutFileExtension(fileName),
            path: getWithoutFileExtension(filePath.replace(/^(\.\/)/, '')), // Get relative path without leading ./
        };
    });

    return `data:text/typescript,${filePathMap
        .map(({ name, path }) => `import ${name} from './${path}';`)
        .join('')}export { index, settings };`;
};

const webpackCompile = async (
    projectPath: string,
    entryFileNames: string[],
    iifeGlobalName: string,
    options: CompilerOptions
): Promise<void> => {
    const compiler = webpack({
        mode: options.env?.NODE_ENV === 'development' ? 'development' : 'production',
        context: projectPath,
        externals: {
            react: 'React',
            'react-dom': 'ReactDOM',
        },
        entry: {
            './_virtual/index.tsx': getVirtualEntry(entryFileNames),
        },
        devtool: options.sourceMap ? 'source-map' : undefined,
        output: {
            library: iifeGlobalName,
            libraryTarget: 'umd',
            path: options.distPath,
            filename: 'index.js',
            iife: true,
        },
        optimization: {
            minimize: options.minify,
        },
        module: {
            rules: [
                {
                    include: [
                        resolve('node_modules', '@frontify/arcade'),
                        resolve('node_modules', '@frontify/app-bridge'),
                    ],
                    sideEffects: false,
                },
                {
                    test: /\.[jt]sx?$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: require.resolve('babel-loader'),
                            options: {
                                presets: [
                                    [
                                        '@babel/preset-env',
                                        {
                                            modules: false,
                                            loose: true,
                                        },
                                    ],
                                    '@babel/preset-typescript',
                                ],
                                plugins: [
                                    ['@babel/plugin-transform-react-jsx'],
                                    ['@babel/plugin-proposal-class-properties', { modules: false, loose: true }],
                                ],
                            },
                        },
                    ],
                },
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader', 'postcss-loader'],
                },
            ],
        },
        resolve: {
            extensions: ['.js', '.ts', '.tsx', '.json'],
        },
        plugins: [
            new DefinePlugin(
                Object.keys(options.env || []).reduce((stack, key) => {
                    stack[`process.env.${key}`] = JSON.stringify(options?.env?.[key] || 'null');
                    return stack;
                }, {})
            ),
        ],
    });

    return new Promise((resolve, reject) =>
        compiler.run((error, stats) => {
            if (error) {
                reject(error.message);
            }

            const info = stats?.toJson();
            if (stats?.hasErrors()) {
                reject(info?.errors?.map((error) => error.message).toString() ?? 'An unknown error occured');
            }

            resolve();
        })
    );
};
