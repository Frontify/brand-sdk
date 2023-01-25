/* (c) Copyright Frontify Ltd., all rights reserved. */

import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import pc from 'picocolors';
import { Logger, copyFolder, updatePackageJsonProjectName } from '../utils';

const PLATFORM_APP_PREFIX = 'platform-app-';

export const createPlatformApp = (platformAppName: string, template = 'tailwind'): void => {
    const templateCSS = 'tailwind';
    Logger.info(`Creating the platform App with ${template}...`);

    const platformAppPathBlue = pc.blue(`./${platformAppName}`);
    Logger.info(`Scaffholding content block in ${platformAppPathBlue}...`);

    const templateDir = resolve(fileURLToPath(import.meta.url), `../../templates/${PLATFORM_APP_PREFIX}${templateCSS}`);
    copyFolder(templateDir, platformAppName, { exclude: ['node_modules'] });

    updatePackageJsonProjectName(platformAppName);

    Logger.defaultInfo(`\n${Logger.spacer(11)}You can now access the project and install dependencies.`);
    const platformAppInBlue = pc.blue(`./${platformAppName}`);
    Logger.defaultInfo(`${Logger.spacer(4)}cd ${platformAppInBlue}`);
    Logger.defaultInfo(`${Logger.spacer(4)}npm ci`);
    Logger.defaultInfo(`${Logger.spacer(4)}npm run serve`);

    Logger.defaultInfo(`\n${Logger.spacer(11)}Happy hacking!`);
};
