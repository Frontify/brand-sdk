import { blue, bold } from "chalk";
import Logger from "../utils/logger";
import { deleteDirectory, isDirectoryEmpty } from "../utils/file";
import { cloneTo, initRepository } from "../utils/git";
import { installDependencies, updatePackageJsonProjectName } from "../utils/npm";

const CUSTOM_BLOCK_BOILERPLATE_GIT_URL = "git@github.com:Frontify/frontify-block-boilerplate.git";

const isValidProjectName = (folderName: string): boolean => {
    if (!folderName) {
        Logger.error("The project name could not be empty.");
        return false;
    } else if (!/^[a-z_]+$/.test(folderName)) {
        Logger.error('The project name needs to be "a-z" separated by "_".');
        return false;
    } else if (!isDirectoryEmpty(folderName)) {
        Logger.error(`The directory ./${folderName} already exist.`);
        return false;
    } else {
        return true;
    }
};

export const createNewProject = async (projectName: string): Promise<void> => {
    if (isValidProjectName(projectName)) {
        Logger.info("Creating a new block...");

        Logger.info(`Cloning boilerplate to ${blue(`./${projectName}`)}.`);
        await cloneTo(CUSTOM_BLOCK_BOILERPLATE_GIT_URL, projectName);

        deleteDirectory(`./${projectName}/.git`);

        Logger.info(`Renaming boilerplate package to ${bold(projectName)}.`);
        updatePackageJsonProjectName(projectName);

        Logger.info(`Installing dependencies with ${bold("npm install")}.`);
        await installDependencies(projectName);

        await initRepository();

        Logger.defaultInfo(`\n${Logger.spacer(11)}Project ready!`);
        Logger.defaultInfo(`You can now run "cd ${blue(`./${projectName}`)}" to access the project.`);
        Logger.defaultInfo("Happy hacking!");
    }
};
