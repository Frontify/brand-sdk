/* (c) Copyright Frontify Ltd., all rights reserved. */

import { Logger, copyFolder, updatePackageJsonProjectName } from '../utils/index.js';
import pc from 'picocolors';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const CONTENT_BLOCK_PREFIX = 'content-block-';
export const createNewContentBlock = (contentBlockName: string, template = 'tailwind'): void => {
    Logger.info('Creating the content block...');

    const blockPathInBlue = pc.blue(`./${contentBlockName}`);
    Logger.info(`Scaffolding content block in ${blockPathInBlue}...`);

    const templateDir = resolve(fileURLToPath(import.meta.url), `../../templates/${CONTENT_BLOCK_PREFIX}${template}`);
    copyFolder(templateDir, contentBlockName, { exclude: ['node_modules'] });

    updatePackageJsonProjectName(contentBlockName);

    Logger.defaultInfo(`\n${Logger.spacer(11)}You can now access the project and install dependencies.`);
    const blockNameInBlue = pc.blue(`./${contentBlockName}`);
    Logger.defaultInfo(`${Logger.spacer(4)}cd ${blockNameInBlue}`);
    Logger.defaultInfo(`${Logger.spacer(4)}npm i`);
    Logger.defaultInfo(`${Logger.spacer(4)}npm run serve`);

    Logger.defaultInfo(`\n${Logger.spacer(11)}Happy hacking!`);
};
export const createNewApp = (appName: string, template, type: string): void => {
    Logger.info(`Creating the ${type}...`);

    const appInBlue = pc.blue(`./${appName}`);
    Logger.info(`Scaffolding App in ${appInBlue}...`);

    const templateDir = resolve(fileURLToPath(import.meta.url), `../../templates/${type}-${template}`);
    copyFolder(templateDir, appName, { exclude: ['node_modules'] });

    updatePackageJsonProjectName(appName);

    Logger.defaultInfo(`\n${Logger.spacer(11)}You can now access the project and install dependencies.`);
    const appNameInBlue = pc.blue(`./${appName}`);
    Logger.defaultInfo(`${Logger.spacer(4)}cd ${appNameInBlue}`);
    Logger.defaultInfo(`${Logger.spacer(4)}npm i`);
    Logger.defaultInfo(`${Logger.spacer(4)}npm run serve`);

    Logger.defaultInfo(`\n${Logger.spacer(11)}Happy hacking!`);
};
