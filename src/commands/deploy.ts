import { bold } from "chalk";
import { join } from "path";
import Logger from "../utils/logger";
import { createZip } from "../utils/zip";
import { getFileHash } from "../utils/hash";

class CreateDeployment {
    private readonly customBlockName: string;
    private readonly customBlockPath: string;
    private readonly customBlockOutDir: string;

    constructor(customBlockName = "default", customBlockPath = process.cwd()) {
        this.customBlockName = customBlockName;
        this.customBlockPath = customBlockPath;
        this.customBlockOutDir = join(this.customBlockPath, ".frontify", "deploy");
    }

    async createZipBundle(): Promise<void> {
        const ignoredDirectories = [".git", ".frontify"];

        createZip(
            this.customBlockPath,
            join(this.customBlockOutDir, `${this.customBlockName}.zip`),
            ignoredDirectories,
        );
    }

    getZipBundleHash(): Promise<string> {
        return getFileHash(join(this.customBlockOutDir, `${this.customBlockName}.zip`));
    }

    sendBundle(hash: string): void {
        Logger.info(`Sending ${bold(this.customBlockName)} with hash ${hash}.`);
    }
}

export const createDeployment = async (customBlockName: string, customBlockPath: string): Promise<void> => {
    Logger.info(`Deploying ${bold(customBlockName)}...`);

    const deployment = new CreateDeployment(customBlockName, customBlockPath);
    // if (Authenticator.isAuthenticated()) {
    if (true) {
        Logger.info("Creating a zip bundle...");
        await deployment.createZipBundle();
        Logger.info("Generating a hash...");
        const hash = await deployment.getZipBundleHash();
        Logger.info(`Sending ${bold(customBlockName)} to Frontify...`);
        deployment.sendBundle(hash);
    } else {
        Logger.error(`You are not connected, please connect using: ${bold("frontify-block-cli login")}.`);
    }
};
