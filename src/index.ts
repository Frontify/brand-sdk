/* (c) Copyright Frontify Ltd., all rights reserved. */

import minimist from 'minimist';
import buildOptions from 'minimist-options';
import { join } from 'path';
import { exit } from 'process';
import { createNewContentBlock } from './commands/createContentBlock';
import { createDeployment } from './commands/deploy';
import { loginUser } from './commands/login';
import { logoutUser } from './commands/logout';
import { createDevelopmentServer } from './commands/serve';
import Logger from './utils/logger';
import { printLogo } from './utils/logo';
import { getValidInstanceUrl } from './utils/url';

enum Argument {
    ContentBlockPath = 'contentBlockPath',
    DryRun = 'dryRun',
    EntryPath = 'entryPath',
    Minify = 'minify',
    NoVerify = 'noVerify',
    OutDir = 'outDir',
    Port = 'port',
    SettingsPath = 'settingsPath',
    ThemePath = 'contentBlockPath',
}

const options = buildOptions({
    [Argument.ContentBlockPath]: {
        type: 'string',
        default: '.',
    },
    [Argument.DryRun]: {
        type: 'boolean',
        default: false,
    },
    [Argument.EntryPath]: {
        type: 'string',
        alias: 'e',
        default: join('src', 'index.tsx'),
    },
    [Argument.Minify]: {
        type: 'boolean',
        alias: 'm',
        default: false,
    },
    [Argument.NoVerify]: {
        type: 'boolean',
        default: false,
    },
    [Argument.OutDir]: {
        type: 'string',
        alias: 'o',
        default: 'dist',
    },
    [Argument.Port]: {
        type: 'number',
        alias: 'p',
        default: 5600,
    },
    [Argument.ThemePath]: {
        type: 'string',
        default: '.',
    },
});
const parseArgs = minimist(process.argv.slice(2), options);

printLogo();

(async () => {
    switch (parseArgs._[0]) {
        case 'block':
            switch (parseArgs._[1]) {
                case 'create':
                    const blockName = parseArgs._[2] || '';
                    createNewContentBlock(blockName);
                    break;

                case 'serve':
                    await createDevelopmentServer(
                        join(process.cwd(), parseArgs[Argument.ContentBlockPath]),
                        parseArgs[Argument.EntryPath],
                        parseArgs[Argument.Port]
                    );
                    break;

                case 'deploy':
                    const instanceUrl = getValidInstanceUrl(parseArgs.instance || process.env.INSTANCE_URL);
                    await createDeployment(
                        instanceUrl,
                        parseArgs[Argument.ContentBlockPath],
                        parseArgs[Argument.EntryPath],
                        parseArgs[Argument.OutDir],
                        {
                            dryRun: parseArgs[Argument.DryRun],
                            noVerify: parseArgs[Argument.NoVerify],
                            openInBrowser: parseArgs.open,
                        }
                    );
                    break;
            }
            break;

        case 'theme':
            switch (parseArgs._[1]) {
                case 'serve':
                    await createDevelopmentServer(
                        join(process.cwd(), parseArgs[Argument.ThemePath]),
                        parseArgs[Argument.EntryPath],
                        parseArgs[Argument.Port]
                    );
                    break;
                case 'deploy':
                    const instanceUrl = getValidInstanceUrl(parseArgs.instance || process.env.INSTANCE_URL);
                    await createDeployment(
                        instanceUrl,
                        parseArgs[Argument.ThemePath],
                        parseArgs[Argument.EntryPath],
                        parseArgs[Argument.OutDir],
                        {
                            dryRun: parseArgs[Argument.DryRun],
                            noVerify: parseArgs[Argument.NoVerify],
                            openInBrowser: parseArgs.open,
                        }
                    );
                    break;
            }
            break;

        case 'login':
            const instanceUrl = getValidInstanceUrl(parseArgs.instance || process.env.INSTANCE_URL);
            await loginUser(instanceUrl, parseArgs[Argument.Port]);
            break;

        case 'logout':
            logoutUser();
            exit(1);

        default:
            Logger.error('This command is not yet handled');
            exit(1);
    }
})();
