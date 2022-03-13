import minimist from 'minimist';
import buildOptions from 'minimist-options';
import { join } from 'path';
import { exit } from 'process';
import { createNewProject } from './commands/create';
import { createDeployment } from './commands/deploy';
import { loginUser } from './commands/login';
import { logoutUser } from './commands/logout';
import { createDevelopmentServer } from './commands/serve';
import { Bundler } from './utils/compile';
import Logger from './utils/logger';
import { printLogo } from './utils/logo';
import { getValidInstanceUrl } from './utils/url';

enum Argument {
    CustomBlockPath = 'customBlockDir',
    DryRun = 'dryRun',
    Experimental = 'experimental',
    EntryPath = 'entryPath',
    Minify = 'minify',
    Port = 'port',
    OutDir = 'outDir',
    SettingsPath = 'settingsPath',
}

const options = buildOptions({
    [Argument.CustomBlockPath]: {
        type: 'string',
        default: 'custom_block',
    },
    [Argument.DryRun]: {
        type: 'boolean',
        default: false,
    },
    [Argument.Experimental]: {
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
    [Argument.SettingsPath]: {
        type: 'string',
        alias: 'e',
        default: join('src', 'settings.ts'),
    },
});
const parseArgs = minimist(process.argv.slice(2), options);

printLogo();

(async () => {
    switch (parseArgs._[0]) {
        case 'block':
            const bundler = parseArgs[Argument.Experimental] ? Bundler.Webpack : Bundler.Rollup;

            switch (parseArgs._[1]) {
                case 'serve':
                    createDevelopmentServer(
                        parseArgs[Argument.CustomBlockPath],
                        [parseArgs[Argument.EntryPath], parseArgs[Argument.SettingsPath]],
                        parseArgs[Argument.Port],
                        {
                            minify: parseArgs[Argument.Minify],
                            bundler,
                        }
                    );
                    break;

                case 'deploy':
                    const instanceUrl = getValidInstanceUrl(parseArgs.instance || process.env.INSTANCE_URL);
                    await createDeployment(
                        instanceUrl,
                        'block',
                        parseArgs[Argument.CustomBlockPath],
                        [parseArgs[Argument.EntryPath], parseArgs[Argument.SettingsPath]],
                        parseArgs[Argument.OutDir],
                        {
                            dryRun: parseArgs[Argument.DryRun],
                            openInBrowser: parseArgs.open,
                            bundler,
                        }
                    );
                    break;
            }
            break;

        case 'create':
            const projectName = parseArgs._[1] || '';
            createNewProject(projectName);
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
