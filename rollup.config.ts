import resolve from "@rollup/plugin-node-resolve";
import esbuild from "rollup-plugin-esbuild";
import commonJs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import externals from "rollup-plugin-node-externals";

export default {
    input: "src/index.ts",
    external: ["rollup"],
    plugins: [
        externals(),
        resolve(),
        json(),
        esbuild({
            minify: process.env.NODE_ENV === "production",
            loaders: {
                ".json": "json",
            },
        }),
        commonJs(),
    ],
    output: [
        {
            file: "dist/index.js",
            format: "cjs",
            sourcemap: true,
            banner: "#!/usr/bin/env node\n",
        },
    ],
};
