/* (c) Copyright Frontify Ltd., all rights reserved. */

import { writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import pc from 'picocolors';

import { Logger, copyFolder, updatePackageJsonProjectName } from '../utils/index';
import { gitignoreTemplate } from '../utils/gitignoreTemplate';

const generateGitignoreFile = (destinationFolderPath: string, type: string): void => {
    const gitignorePath = join(destinationFolderPath, '.gitignore');
    writeFileSync(gitignorePath, gitignoreTemplate[type]);
};

export const createNewApp = (appName: string, template: string, type: string): void => {
    Logger.info(`Creating the ${type}...`);

    const appInBlue = pc.blue(`./${appName}`);
    Logger.info(`Scaffolding App in ${appInBlue}...`);

    const templateDir = resolve(fileURLToPath(import.meta.url), `../../templates/${type}-${template}`);
    copyFolder(templateDir, appName, { exclude: ['node_modules'] });

    generateGitignoreFile(appName, type);
    updatePackageJsonProjectName(appName);

    Logger.defaultInfo(`\n${Logger.spacer(11)}You can now access the project and install dependencies.`);
    const appNameInBlue = pc.blue(`./${appName}`);
    Logger.defaultInfo(`${Logger.spacer(4)}cd ${appNameInBlue}`);
    Logger.defaultInfo(`${Logger.spacer(4)}npm i`);
    Logger.defaultInfo(`${Logger.spacer(4)}npm run serve`);

    Logger.defaultInfo(`\n${Logger.spacer(11)}Happy hacking!`);
};
