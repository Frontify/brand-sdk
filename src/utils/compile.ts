import esbuild from "esbuild";
import cssModulesPlugin from "esbuild-css-modules-plugin";
import { join } from "path";
import CompilationFailedError from "../errors/CompilationFailedError";

interface Options {
    distPath?: string;
    env?: Record<string, string>;
    minify?: boolean;
}

export const compile = async (
    projectPath: string,
    entryFileName: string,
    globalName: string,
    { distPath = "dist", env = {}, minify = false }: Options,
): Promise<void> => {
    try {
        await esbuild.build({
            color: true,
            entryPoints: [join(projectPath, entryFileName)],
            outfile: join(distPath, "index.js"),
            bundle: true,
            sourcemap: true,
            banner: {
                js: `
                    window.require = (moduleName) => {
                        switch (moduleName) {
                            case "react":
                                return window["React"];
                            case "quill":
                                return window["Quill"];
                            default:
                                throw new Error("Could not resolve module");
                        }
                    };`
            },
            external: ["react", "quill"],
            define: Object.keys(env).reduce((stack, key) => {
                stack[`process.env.${key}`] = `"${env[key]}"`;
                return stack;
            }, {}),
            tsconfig: join(projectPath, "tsconfig.json"),
            logLevel: "error",
            target: ["es2019", "edge18", "firefox60", "chrome61", "safari11"],
            plugins: [cssModulesPlugin()],
            minify,
            globalName,
        });
    } catch (error) {
        throw new CompilationFailedError(error);
    }
};
