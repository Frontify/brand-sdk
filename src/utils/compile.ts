import { startService } from "esbuild";
import Logger from "./logger";
import { join } from 'path'

export const compile = async (entryFileName: string, projectPath: string, distPath: string): Promise<void> => {
    Logger.info("Compiling...");

    const service = await startService();

    try {
        await service.build({
            color: true,
            entryPoints: [join(projectPath, entryFileName)],
            outfile: `${distPath}/index.js`,
            //minify: true,
            bundle: true,
            sourcemap: false,
            define: {
                "process.env.NODE_ENV": "development",
            },
            tsconfig: join(projectPath, "tsconfig.json"), // Use tsconfig from the project
            platform: "node",
            logLevel: "error",
            target: ["chrome58", "firefox57", "safari11", "edge16"],
            format: "iife",
            globalName: "DevCustomBlock",
        });

        Logger.info("Compiled successfully!");
    } catch (e) {
        Logger.error("An error occured", e);
    } finally {
        service.stop();
    }
};
