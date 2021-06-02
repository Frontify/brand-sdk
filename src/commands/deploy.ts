import Logger from "../utils/logger";
import { getUser } from "../utils/user";
import { getValidInstanceUrl } from "../utils/url";
import { compile } from "../utils/compile";
import { reactiveJson } from "../utils/reactiveJson";
import { join } from "path";

export const createDeployment = async (
    instanceUrl: string,
    surface: string,
    projectPath: string,
    entryFileName: string,
    distPath: string,
): Promise<void> => {
    Logger.info(`Deploying the custom block...`);

    try {
        const cleanedInstanceUrl = getValidInstanceUrl(instanceUrl);
        const user = await getUser(cleanedInstanceUrl);

        if (user) {
            Logger.info(`You are logged in as ${user.name} (${cleanedInstanceUrl}).`);

            Logger.info("Getting the app id");
            const manifest = reactiveJson<Manifest>("manifest.json");

            Logger.info("Compile code");
            await compile(projectPath, entryFileName, `${surface}_${manifest.appId}`, {
                distPath: join(projectPath, distPath),
                env: {
                    NODE_ENV: "production",
                },
            });
        }
    } catch {
        Logger.error("The deployment has failed and was aborted.");
    }
};
