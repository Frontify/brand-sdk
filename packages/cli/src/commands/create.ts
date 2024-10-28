/* (c) Copyright Frontify Ltd., all rights reserved. */

import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import pc from 'picocolors';

import { Logger, copyFolder, updatePackageJsonProjectName } from '../utils/index';
import { writeFileSync } from 'node:fs';

const GITIGNORE_TEMPLATE = `
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.localdist
.idea
.vscode

# Editor directories and files
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
.secret.json
`;

export const createNewApp = (appName: string, template: string, type: string): void => {
    Logger.info(`Creating the ${type}...`);

    const appInBlue = pc.blue(`./${appName}`);
    Logger.info(`Scaffolding App in ${appInBlue}...`);

    const templateDir = resolve(fileURLToPath(import.meta.url), `../../templates/${type}-${template}`);
    copyFolder(templateDir, appName, { exclude: ['node_modules'] });

    const gitignorePath = join(templateDir, '.gitignore');
    writeFileSync(gitignorePath, GITIGNORE_TEMPLATE);

    updatePackageJsonProjectName(appName);

    Logger.defaultInfo(`\n${Logger.spacer(11)}You can now access the project and install dependencies.`);
    const appNameInBlue = pc.blue(`./${appName}`);
    Logger.defaultInfo(`${Logger.spacer(4)}cd ${appNameInBlue}`);
    Logger.defaultInfo(`${Logger.spacer(4)}npm i`);
    Logger.defaultInfo(`${Logger.spacer(4)}npm run serve`);

    Logger.defaultInfo(`\n${Logger.spacer(11)}Happy hacking!`);
};
