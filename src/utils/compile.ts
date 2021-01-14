import { startService } from "esbuild";
import Logger from "./logger";

export const compile = async (entryFilePath: string, distPath: string): Promise<void> => {
    const service = await startService();

    try {
        const timerStart = Date.now();

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

        const timerEnd = Date.now();
        Logger.info(`Custom block built in ${timerEnd - timerStart}ms`);
    } catch (e) {
        Logger.error("An error occured", e);
    } finally {
        service.stop();
    }
};
