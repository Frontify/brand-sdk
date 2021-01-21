import { bold, blue } from "chalk";
import Logger from "../utils/logger";
import { join, resolve } from "path";
import { readdirSync } from "fs";
import { promiseExec } from "../utils/promiseExec";
import { reactiveJson } from "../utils/reactiveJson";

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
        } else if (!/^[a-z_]+$/.test(this.projectName)) {
            Logger.error('The project name needs to be "a-z" separated by "_".');
            return false;
        } else if (!this.isDirectoryEmpty(this.projectPath)) {
            Logger.error(`The directory ./${this.projectName} already exist.`);
            return false;
        } else {
            return true;
        }
    }

    async cloneBoilerplate(): Promise<void> {
        const projectPath = `./${this.projectName}`;
        Logger.info(`Cloning boilerplate to ${blue(projectPath)}.`);

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
        Logger.info(`Installing dependencies with ${bold("npm install")}.`);

        await promiseExec("npm install", { cwd: this.projectPath }).catch((error) => {
            Logger.error(`Could not install dependencies:`, error.message);
        });
    }

    updatePackageJsonProjectName(): void {
        Logger.info(`Renaming boilerplate to ${bold(this.projectName)}.`);

        const packageJsonPath = resolve(this.projectPath, "package.json");
        const packageJson = reactiveJson(packageJsonPath);
        packageJson.name = this.projectName;
    }
}

export const createNewProject = async (projectName: string): Promise<void> => {
    Logger.info("Creating a new block...");

    const createNewProject = new CreateProject(projectName);
    if (createNewProject.validProjectName()) {
        await createNewProject.cloneBoilerplate();
        createNewProject.updatePackageJsonProjectName();
        await createNewProject.installDeps();

        const projectPath = `./${projectName}`;

        Logger.defaultInfo(`\n${Logger.spacer(11)}Project ready!`);
        Logger.defaultInfo(`${Logger.spacer(11)}You can now "cd ${blue(projectPath)}" to access the project.`);
        Logger.defaultInfo(`${Logger.spacer(11)}Happy hacking!`);
    }
};
