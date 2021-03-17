import { startService } from "esbuild";
import Logger from "./logger";
import { join } from "path";

export const compile = async (entryFileName: string, projectPath: string, distPath: string): Promise<void> => {
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
            define: {
                "process.env.NODE_ENV": '"development"',
            },
            tsconfig: join(projectPath, "tsconfig.json"),
            logLevel: "error",
            target: ["chrome58", "firefox57", "safari11", "edge16"],
            globalName: `DevCustomBlock`,
        });

        Logger.info("Compiled successfully!");
    } catch (e) {
        Logger.error("An error occured", e);
    } finally {
        service.stop();
    }
};
