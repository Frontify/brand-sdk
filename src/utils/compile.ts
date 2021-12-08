import { join } from "path";
import { webpack, DefinePlugin } from "webpack";

export interface CompilerOptions {
    distPath?: string;
    tsconfigPath?: string;
    env?: Record<string, string>;
    minify?: boolean;
    sourceMap?: boolean;
    treeshake?: boolean | "smallest";
}

export const compile = async (
    projectPath: string,
    entryFilePath: string,
    iifeGlobalName: string,
    options: CompilerOptions,
): Promise<void> => {
    const defaultOptions: CompilerOptions = {
        distPath: "dist",
        tsconfigPath: "tsconfig.json",
        env: {},
        minify: true,
        sourceMap: true,
        treeshake: true,
    };

    const mergedOptions = {
        ...defaultOptions,
        ...options,
    };

    const compiler = webpack({
        mode: mergedOptions.env?.NODE_ENV === "development" ? "development" : "production",
        context: projectPath,
        externals: {
            react: "React",
            "react-dom": "ReactDOM",
        },
        entry: join(projectPath, entryFilePath),
        output: {
            library: iifeGlobalName,
            libraryTarget: "umd",
            path: join(projectPath, "dist"),
            filename: "index.js",
            iife: true,
        },
        optimization: {
            concatenateModules: false,
        },
        module: {
            rules: [
                {
                    test: /\.[jt]sx?$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: require.resolve("babel-loader"),
                            options: {
                                presets: [
                                    [
                                        "@babel/preset-env",
                                        {
                                            modules: false,
                                            loose: true,
                                        },
                                    ],
                                    "@babel/preset-typescript",
                                ],
                                plugins: [
                                    ["@babel/plugin-transform-react-jsx"],
                                    ["@babel/plugin-proposal-class-properties", { modules: false, loose: true }],
                                ],
                            },
                        },
                    ],
                },
                {
                    test: /\.css$/,
                    use: ["style-loader", "css-loader", "postcss-loader"],
                },
            ],
        },
        resolve: {
            extensions: [".js", ".ts", ".tsx", ".json"],
        },
        plugins: [
            new DefinePlugin(
                Object.keys(mergedOptions.env || []).reduce((stack, key) => {
                    stack[`process.env.${key}`] = JSON.stringify(mergedOptions?.env?.[key] || "null");
                    return stack;
                }, {}),
            ),
        ],
    });

    return new Promise((resolve) =>
        compiler.run((error, stats) => {
            if (error) {
                console.log("error", error);
            }
            const info = stats?.toJson();
            if (stats?.hasErrors()) {
                console.error(info?.errors);
            }

            if (stats?.hasWarnings()) {
                console.warn(info?.warnings);
            }
            resolve();
        }),
    );
};
