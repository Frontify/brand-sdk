/* (c) Copyright Frontify Ltd., all rights reserved. */

import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import pc from 'picocolors';
import { Logger, copyFolder, updatePackageJsonProjectName } from '../utils/index.js';

const PLATFORM_APP_PREFIX = 'platform-app-';

export const createNewPlatformApp = (appName: string, template = 'tailwind'): void => {
    Logger.info('Creating the App...');

    const appInBlue = pc.blue(`./${appName}`);
    Logger.info(`Scaffolding App in ${appInBlue}...`);

    const templateDir = resolve(fileURLToPath(import.meta.url), `../../templates/${PLATFORM_APP_PREFIX}${template}`);
    copyFolder(templateDir, appName, { exclude: ['node_modules'] });

    updatePackageJsonProjectName(appName);

    Logger.defaultInfo(`\n${Logger.spacer(11)}You can now access the project and install dependencies.`);
    const appNameInBlue = pc.blue(`./${appName}`);
    Logger.defaultInfo(`${Logger.spacer(4)}cd ${appNameInBlue}`);
    Logger.defaultInfo(`${Logger.spacer(4)}npm i`);
    Logger.defaultInfo(`${Logger.spacer(4)}npm run dev`);

    Logger.defaultInfo(`\n${Logger.spacer(11)}Happy hacking!`);
};
