import chalk from "chalk";
import Logger from "../utils/logger";
import { join } from "path";
import { readdirSync } from "fs";
import { promiseExec } from "../utils/promiseExec";

class CreateProject {
    private readonly boilerplateGitUrl = "git@github.com:Frontify/frontify-block-boilerplate.git";
    private readonly projectName: string;
    private readonly projectPath: string;

    constructor(projectName: string) {
        this.projectName = projectName;
        this.projectPath = join(process.cwd(), this.projectName);
    }

    validProjectName(): boolean {
        if (!this.projectName) {
            Logger.error("The project name could not be empty.");
            return false;
        } else if (!/[a-z_]+/.test(this.projectName)) {
            Logger.error('The project name needs to be "a-z" separated by "-".');
            return false;
        } else if (!this.isDirectoryEmpty(this.projectPath)) {
            Logger.error(`The directory "./${this.projectName}" already exist.`);
            return false;
        } else {
            return true;
        }
    }

    async cloneBoilerplate(): Promise<void> {
        const projectPath = `./${this.projectName}`;
        Logger.info(`Cloning boilerplate to ${chalk.blue(projectPath)}.`);

        await promiseExec(`git clone ${this.boilerplateGitUrl} ${this.projectName}`).catch((error) => {
            Logger.error("Error while cloning the boilerplate:", error.message);
        });
    }

    isDirectoryEmpty(path: string): boolean {
        try {
            return readdirSync(path).length === 0;
        } catch {
            return true;
        }
    }

    async installDeps(): Promise<void> {
        Logger.info("Installing dependencies:", chalk.bold("npm install"));

        await promiseExec("npm install", { cwd: this.projectPath }).catch((error) => {
            Logger.error(`Could not install dependencies:`, error.message);
        });
    }
}

export const createNewProject = async (projectName: string): Promise<void> => {
    const createNewProject = new CreateProject(projectName);
    if (createNewProject.validProjectName()) {
        await createNewProject.cloneBoilerplate();
        await createNewProject.installDeps();
    }
};
