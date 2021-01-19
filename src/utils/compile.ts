import { startService } from "esbuild";
import Logger from "./logger";
import { join } from "path";
import chalk from "chalk";

export const compile = async (
    blockName: string,
    entryFileName: string,
    projectPath: string,
    distPath: string,
): Promise<void> => {
    Logger.info(`Compiling ${chalk.bold(blockName)}...`);

    const service = await startService();

    try {
        await service.build({
            color: true,
            entryPoints: [join(projectPath, entryFileName)],
            outfile: `${distPath}/${blockName}.js`,
            //minify: true,
            bundle: true,
            sourcemap: true,
            define: {
                "process.env.NODE_ENV": "development",
            },
            tsconfig: join(projectPath, "tsconfig.json"), // Use tsconfig from the project
            logLevel: "error",
            target: ["chrome58", "firefox57", "safari11", "edge16"],
            globalName: `DevCustomBlock["${blockName}"]`,
        });

        Logger.info("Compiled successfully!");
    } catch (e) {
        Logger.error("An error occured", e);
    } finally {
        service.stop();
    }
};
