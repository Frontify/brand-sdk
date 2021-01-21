import { bold } from "chalk";
import { join } from "path";
import Logger from "../utils/logger";
import { createZip } from "../utils/zip";
import { getFileHash } from "../utils/hash";
import { getUser } from "../utils/user";
import { mkdir } from "fs";
import { getValidInstanceUrl } from "../utils/url";

class CreateDeployment {
    private readonly instanceUrl: string;
    private readonly customBlockName: string;
    private readonly customBlockPath: string;
    private readonly customBlockOutDir: string;

    constructor(instanceUrl: string, customBlockName = "default", customBlockPath = process.cwd()) {
        this.instanceUrl = instanceUrl;
        this.customBlockName = customBlockName;
        this.customBlockPath = customBlockPath;
        this.customBlockOutDir = join(this.customBlockPath, ".frontify", "deploy");
    }

    async createZipBundle(): Promise<void> {
        const ignoredDirectories = [".git/**", ".frontify/**", "node_modules/**", "dist/**"];

        await new Promise((resolve, reject) => {
            mkdir(this.customBlockOutDir, { recursive: true }, (error) => {
                if (error) return reject(error);
                resolve(this.customBlockOutDir);
            });
        });

        await createZip(
            this.customBlockPath,
            join(this.customBlockOutDir, `${this.customBlockName}.zip`),
            ignoredDirectories,
        );
    }

    getZipBundleHash(): Promise<string> {
        return getFileHash(join(this.customBlockOutDir, `${this.customBlockName}.zip`));
    }
}

export const createDeployment = async (
    instanceUrl: string,
    customBlockName: string,
    customBlockPath: string,
): Promise<void> => {
    Logger.info(`Deploying ${bold(customBlockName)}...`);

    const cleanedInstanceUrl = getValidInstanceUrl(instanceUrl);

    const deployment = new CreateDeployment(cleanedInstanceUrl, customBlockName, customBlockPath);

    const user = await getUser(cleanedInstanceUrl);

    if (user) {
        Logger.info(`You are logged in as ${user.name} (${cleanedInstanceUrl}).`);
        Logger.info("Creating a zip bundle...");
        await deployment.createZipBundle();
        Logger.info("Generating a hash...");
        const hash = await deployment.getZipBundleHash();
        Logger.info(`Sending ${bold(customBlockName)} with hash ${hash} to your Frontify instance...`);
        //deployment.sendBundle(hash);
    }
};
