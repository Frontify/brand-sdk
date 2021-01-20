import { bold } from "chalk";
import { join } from "path";
import Logger from "../utils/logger";
import { createZip } from "../utils/zip";
import { getFileHash } from "../utils/hash";
import { getUser } from "../utils/oauth";
import { mkdir } from "fs";

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

    sendBundle(hash: string): void {
        //
    }
}

export const createDeployment = async (customBlockName: string, customBlockPath: string): Promise<void> => {
    Logger.info(`Deploying ${bold(customBlockName)}...`);

    const deployment = new CreateDeployment(customBlockName, customBlockPath);

    const user = await getUser();

    if (user) {
        Logger.info(`You are logged in as ${user.name}.`);
        Logger.info("Creating a zip bundle...");
        await deployment.createZipBundle();
        Logger.info("Generating a hash...");
        const hash = await deployment.getZipBundleHash();
        Logger.info(`Sending ${bold(customBlockName)} with hash ${hash} to Frontify...`);
        deployment.sendBundle(hash);
    }
};
