import fastGlob from "fast-glob";
import Logger from "../utils/logger";
import open from "open";
import { getUser, UserInfo } from "../utils/user";
import { compile } from "../utils/compile";
import { reactiveJson } from "../utils/reactiveJson";
import { join } from "path";
import { readFileAsBase64, readFileLinesAsArray } from "../utils/file";
import { HttpClient } from "../utils/httpClient";
import { promiseExec } from "../utils/promiseExec";
import { blue } from "chalk";

interface Options {
    dryRun?: boolean;
    openInBrowser?: boolean;
}

const makeFilesDict = async (glob: string, ignoreGlobs?: string[]) => {
    const folderFiles = await fastGlob(join(glob, "**"), { ignore: ignoreGlobs });

    const folderFilenames = folderFiles.map((filePath) => filePath.replace(glob, ""));

    return folderFilenames.reduce((stack, filename, index) => {
        stack[filename] = readFileAsBase64(folderFiles[index]);
        return stack;
    }, {});
};

export const createDeployment = async (
    instanceUrl: string,
    surface: string,
    rootPath: string,
    projectPath: string,
    entryFileName: string,
    distPath: string,
    { dryRun = false, openInBrowser = false }: Options,
): Promise<void> => {
    try {
        let user: UserInfo | undefined;
        if (!dryRun) {
            user = await getUser(instanceUrl);
            user && Logger.info(`You are logged in as ${user.name} (${instanceUrl}).`);
        }

        if (user || dryRun) {
            dryRun && Logger.info(blue("Dry run: enabled"));

            const manifest = reactiveJson<Manifest>(join(rootPath, "manifest.json"));

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

            const FILE_BLOCK_LIST = [".git", "node_modules", "dist", ".vscode", ".idea", "README.md"];
            const gitignoreEntries = readFileLinesAsArray(join(projectPath, ".gitignore"));
            const filesToIgnore = [...gitignoreEntries, ...FILE_BLOCK_LIST].map((path) => join(projectPath, path));

            const request = {
                build_files: await makeFilesDict(join(projectPath, distPath)),
                source_files: await makeFilesDict(join(projectPath), filesToIgnore),
            };

            if (!dryRun) {
                Logger.info("Sending the files to Frontify Marketplace...");

                const httpClient = new HttpClient(instanceUrl);
                await httpClient.put(`/api/marketplace-app/apps/${manifest.appId}`, request);

                Logger.success("The new version has been pushed.");

                if (openInBrowser) {
                    Logger.info("Opening the Frontify Marketplace page...");
                    await open(`https://${instanceUrl}/marketplace/apps/${manifest.appId}`);
                }
            } else {
                Logger.success("The command has been executed without any issue.");
            }
        }
    } catch (error) {
        Logger.error("The deployment has failed and was aborted.", error);
    }
};
