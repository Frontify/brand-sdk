import { resolve } from "path";
import Logger from "./logger";
import { promiseExec } from "./promiseExec";
import { reactiveJson } from "./reactiveJson";

export const installDependencies = async (folderPath: string): Promise<void> => {
    await promiseExec("npm install", { cwd: folderPath }).catch((error) => {
        Logger.error(`Could not install dependencies:`, error.message);
    });
};

export const updatePackageJsonProjectName = (folderPath: string): void => {
    const packageJsonPath = resolve(folderPath, "package.json");
    const packageJson = reactiveJson<PackageJson>(packageJsonPath);
    packageJson.name = folderPath;
};
