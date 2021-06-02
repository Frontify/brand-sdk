import { startService } from "esbuild";
import Logger from "./logger";
import { join } from "path";

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
    Logger.info(`Compiling...`);

    const service = await startService();

    try {
        await service.build({
            color: true,
            entryPoints: [join(projectPath, entryFileName)],
            outfile: join(distPath, "index.js"),
            bundle: true,
            sourcemap: true,
            inject: [join("node_modules", "frontify-cli", "src", "shims.js")],
            external: ["react", "quill"],
            define: Object.keys(env).reduce((stack, key) => {
                stack[`process.env.${key}`] = `"${env[key]}"`;
                return stack;
            }, {}),
            tsconfig: join(projectPath, "tsconfig.json"),
            logLevel: "error",
            target: ["chrome58", "firefox57", "safari11", "edge16"],
            minify,
            globalName,
        });

        Logger.info("Compiled successfully!");
    } catch (e) {
        Logger.error("An error occured", e);
    } finally {
        service.stop();
    }
};
