import Logger from "../utils/logger";
import { getUser } from "../utils/user";
import { getValidInstanceUrl } from "../utils/url";
import { compile } from "../utils/compile";
import { reactiveJson } from "../utils/reactiveJson";
import { join, sep } from "path";
import fastGlob from "fast-glob";
import { readFileAsBase64 } from "../utils/file";
import { HttpClient } from "../utils/httpClient";
import { promiseExec } from "../utils/promiseExec";
import open from "open";

const makeFilesDict = async (glob: string) => {
    const folderFiles = await fastGlob(join(glob, "**"));
    const folderFilenames = folderFiles.map((filePath) => filePath.replace(glob + sep, ""));

    return folderFilenames.reduce((stack, filename, index) => {
        stack[filename] = readFileAsBase64(folderFiles[index]);
        return stack;
    }, {});
};

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

            const manifest = reactiveJson<Manifest>("manifest.json");

            Logger.info("Performing type checks...");
            await promiseExec(`cd ${projectPath} && ./node_modules/.bin/tsc --noEmit`);

            Logger.info("Performing eslint checks...");
            await promiseExec(`cd ${projectPath} && ./node_modules/.bin/eslint src`);

            Logger.info("Running security checks...");
            await promiseExec(`cd ${projectPath} && npm audit --audit-level=high`);

            Logger.info("Compiling code...");
            await compile(projectPath, entryFileName, `${surface}_${manifest.appId}`, {
                distPath: join(projectPath, distPath),
                env: {
                    NODE_ENV: "production",
                },
            });

            Logger.info("Sending the files to Frontify Marketplace...");

            const request = {
                build_files: await makeFilesDict(join(projectPath, distPath)),
                source_files: await makeFilesDict(join(projectPath, "src")),
            };

            const httpClient = new HttpClient(instanceUrl);
            await httpClient.put(`/api/marketplace-app/apps/${manifest.appId}`, request);

            Logger.info("The new version has been pushed.");

            Logger.info("Opening the Frontify Marketplace page");

            await open(`https://${instanceUrl}/marketplace/apps/${manifest.appId}`);
        }
    } catch (error) {
        Logger.error("The deployment has failed and was aborted.", error);
    }
};
