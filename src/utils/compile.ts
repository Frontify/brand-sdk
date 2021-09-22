import { join } from "path";
import CompilationFailedError from "../errors/CompilationFailedError";
import { rollup, RollupOptions, OutputOptions } from "rollup";
import esbuild from "rollup-plugin-esbuild";
import json from "@rollup/plugin-json";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import combine from "rollup-plugin-combine";
import postcss from "rollup-plugin-postcss";

interface Options {
    distPath?: string;
    tsconfigPath?: string;
    env?: Record<string, string>;
    minify?: boolean;
    sourceMap?: boolean;
}

export const compile = async (
    projectPath: string,
    entryFileNames: string[],
    iifeGlobalName: string,
    { distPath = "dist", tsconfigPath = "tsconfig.json", env = {}, minify = false, sourceMap = true }: Options,
): Promise<void> => {
    const rollupConfig: RollupOptions = {
        external: ["react"],
        input: entryFileNames.map((entryFileName) => join(projectPath, entryFileName)),
        plugins: [
            nodeResolve({
                extensions: [".js", ".ts", ".tsx", ".json"],
            }),
            json(),
            combine({
                exports: "named",
            }),
            esbuild({
                sourceMap,
                minify,
                target: "es6",
                define: Object.keys(env).reduce((stack, key) => {
                    stack[`process.env.${key}`] = `"${env[key]}"`;
                    return stack;
                }, {}),
                tsconfig: tsconfigPath,
                experimentalBundling: true,
            }),
            postcss({
                config: {
                    path: join(projectPath, "postcss.config.js"),
                    ctx: {},
                },
            }),
        ],
    };

    const outputConfig: OutputOptions = {
        dir: distPath,
        format: "iife",
        name: iifeGlobalName,
    };

    try {
        const bundle = await rollup(rollupConfig);

        await bundle.write(outputConfig);

        await bundle.close();
    } catch (error) {
        throw new CompilationFailedError(error as string);
    }
};
