import { startService } from "esbuild";
import Logger from "./logger";

export const compile = async (entryFilePath: string, distPath: string): Promise<void> => {
    Logger.info("Compiling...");

    const service = await startService();

    try {
        await service.build({
            color: true,
            entryPoints: [entryFilePath],
            outfile: `${distPath}/index.js`,
            //minify: true,
            bundle: true,
            sourcemap: false,
            define: {
                "process.env.NODE_ENV": "development",
            },
            tsconfig: "./tsconfig.json",
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
