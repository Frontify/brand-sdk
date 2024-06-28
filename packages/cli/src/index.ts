/* (c) Copyright Frontify Ltd., all rights reserved. */

import { join } from 'node:path';
import { exit } from 'node:process';

import { cac } from 'cac';
import prompts from 'prompts';

import pkg from '../package.json';

import {
    type AppManifest,
    createDeployment,
    createDevelopmentServer,
    createDevelopmentServerForPlatformApp,
    createNewApp,
    loginUser,
    logoutUser,
    createDevelopmentServerForTheme,
} from './commands/index';
import {
    compileBlock,
    compilePlatformApp,
    compileTheme,
    getValidInstanceUrl,
    isValidName,
    reactiveJson,
} from './utils/index';

const cli = cac(pkg.name.split('/')[1]);

cli.command('login [instanceUrl]', 'log in to a Frontify instance')
    .option('-i, --instance <instanceUrl>', '[string] url of the Frontify instance')
    .option('-p, --port <port>', '[number] port for the oauth service', {
        default: process.env.PORT || 5600,
    })
    .action(async (instanceUrl: string, options) => {
        const computedInstanceUrl = instanceUrl || options.instance || process.env.INSTANCE_URL;
        computedInstanceUrl && prompts.inject([computedInstanceUrl]);

        const { promptedInstanceUrl } = await prompts([
            {
                type: 'text',
                name: 'promptedInstanceUrl',
                message: 'Enter a Frontify instance URL',
                initial: 'instanceName.frontify.com',
                validate: (value: string) => (value.trim() === '' ? 'You need to enter a valid URL.' : true),
            },
        ]);

        if (!promptedInstanceUrl) {
            exit(0);
        }

        const parsedInstanceUrl = getValidInstanceUrl(promptedInstanceUrl);

        await loginUser(parsedInstanceUrl, options.port);
    });

cli.command('logout', 'log out of an instance').action(logoutUser);

/**
 * @deprecated `block serve` and `theme serve` will be removed in version 4.0 in favour of `serve`
 */
for (const appType of ['block', 'theme']) {
    cli.command(`${appType} serve`, `[deprecated: use 'serve' instead] serve the ${appType} locally`)
        .alias(`${appType} dev`)
        .option('-e, --entryPath, --entry-path <entryPath>', `[string] path to the ${appType} entry file`, {
            default: join('src', 'index.tsx'),
        })
        .option('--port <port>', '[number] specify port', {
            default: process.env.PORT || 5600,
        })
        .option('--allowExternal, --allow-external', '[boolean] allow external IPs to access the server', {
            default: false,
        })
        .action(async (options) => {
            await createDevelopmentServer(options.entryPath, options.port, options.allowExternal);
        });
}

cli.command('serve', 'serve the app locally')
    .alias('dev')
    .option('-e, --entryPath, --entry-path <entryPath>', '[string] path to the entry file', {
        default: join('src', 'index.ts'),
    })
    .option('--port <port>', '[number] specify port', {
        default: process.env.PORT || 5600,
    })
    .option('--allowExternal, --allow-external', '[boolean] allow external IPs to access the server', {
        default: false,
    })
    .option('--appType <appType>, --app-type', '[string] specify app type. Overrides manifest values')
    .action(async (options) => {
        const manifest = reactiveJson<AppManifest>(join(process.cwd(), 'manifest.json'));
        const appType = options.appType || manifest.appType;

        if (appType === 'platform-app') {
            await createDevelopmentServerForPlatformApp(options.port);
        } else if (appType === 'theme') {
            await createDevelopmentServerForTheme(options.entryPath, options.port, options.allowExternal);
        } else {
            await createDevelopmentServer(options.entryPath, options.port, options.allowExternal);
        }
    });

/**
 * @deprecated `block deploy` and `theme deploy` will be removed in version 4.0 in favour of `deploy`
 */
for (const appType of ['block', 'theme']) {
    cli.command(`${appType} deploy`, `[deprecated: use 'deploy' instead] deploy the ${appType} to the marketplace`)
        .option('-e, --entryPath <entryPath>', '[string] path to the entry file', { default: join('src', 'index.tsx') })
        .option('-o, --outDir <outDir>', '[string] path to the output directory', { default: 'dist' })
        .option('--dryRun, --dry-run', '[boolean] enable the dry run mode', { default: false })
        .option('--noVerify, --no-verify', '[boolean] disable the linting and typechecking', { default: false })
        .option('--open', '[boolean] open the marketplace app page', { default: false })
        .action(async (options) => {
            await createDeployment(
                options.entryPath,
                options.outDir,
                {
                    dryRun: options.dryRun,
                    noVerify: options.noVerify,
                    openInBrowser: options.open,
                },
                appType === 'theme' ? compileTheme : compileBlock,
            );
        });
}

cli.command('deploy', 'deploy the app to the marketplace')
    .option('-e, --entryPath <entryPath>', '[string] path to the entry file', { default: join('src', 'index.ts') })
    .option('-o, --outDir <outDir>', '[string] path to the output directory', { default: 'dist' })
    .option('--dryRun, --dry-run', '[boolean] enable the dry run mode', { default: false })
    .option('--noVerify, --no-verify', '[boolean] disable the linting and typechecking', { default: false })
    .option('--open', '[boolean] open the marketplace app page', { default: false })
    .option('--appType [appType], --app-type', '[string] specify app type. Overrides manifest values')
    .option('-i, --instance <instanceUrl>', '[string] url of the Frontify instance')
    .option('-t, --token <accessToken>', '[string] the access token')
    .action(async (options) => {
        const manifest = reactiveJson<AppManifest>(join(process.cwd(), 'manifest.json'));
        const appType = options.appType || manifest.appType;

        if (appType === 'platform-app') {
            await createDeployment(
                options.entryPath,
                options.outDir,
                {
                    dryRun: options.dryRun,
                    noVerify: options.noVerify,
                    openInBrowser: options.open,
                    instance: options.instance,
                    token: options.token,
                },
                compilePlatformApp,
            );
        } else if (appType === 'theme') {
            await createDeployment(
                options.entryPath,
                options.outDir,
                {
                    dryRun: options.dryRun,
                    noVerify: options.noVerify,
                    openInBrowser: options.open,
                    instance: options.instance,
                    token: options.token,
                },
                compileTheme,
            );
        } else {
            await createDeployment(
                options.entryPath,
                options.outDir,
                {
                    dryRun: options.dryRun,
                    noVerify: options.noVerify,
                    openInBrowser: options.open,
                    instance: options.instance,
                    token: options.token,
                },
                compileBlock,
            );
        }
    });

cli.command('create [appName]', 'create a new marketplace app')
    .option('-e, --experimental', 'set experimental flag')
    .action(async (appName: string, options) => {
        if (options.experimental) {
            const { promptedAppName, stylingFramework, appType } = await prompts([
                {
                    type: 'text',
                    name: 'promptedAppName',
                    message: 'Enter your app name',
                    initial: appName || 'my-frontify-app',
                    validate: (value: string) => {
                        if (value.trim() === '') {
                            return 'You need to enter an app name.';
                        }

                        return isValidName(value);
                    },
                },
                {
                    type: 'select',
                    name: 'appType',
                    message: 'Select the type of your app',
                    choices: [
                        { title: 'App', value: 'platform-app' },
                        { title: 'Block', value: 'content-block' },
                    ],
                },
                {
                    type: 'select',
                    name: 'stylingFramework',
                    message: 'Choose a styling framework',
                    choices: [
                        { title: 'Tailwind', value: 'tailwind' },
                        { title: 'CSS Modules', value: 'css-modules' },
                        { title: 'None', value: 'css' },
                    ],
                },
            ]);

            if (!promptedAppName || !stylingFramework || !appType) {
                exit(0);
            }

            createNewApp(promptedAppName, stylingFramework, appType);
        } else {
            const { promptedAppName, stylingFramework } = await prompts([
                {
                    type: 'text',
                    name: 'promptedAppName',
                    message: 'Enter your app name',
                    initial: appName || 'my-frontify-app',
                    validate: (value: string) => {
                        if (value.trim() === '') {
                            return 'You need to enter an app name.';
                        }
                        return isValidName(value);
                    },
                },
                {
                    type: 'select',
                    name: 'stylingFramework',
                    message: 'Choose a styling framework',
                    choices: [
                        { title: 'Tailwind', value: 'tailwind' },
                        { title: 'CSS Modules', value: 'css-modules' },
                        { title: 'None', value: 'css' },
                    ],
                },
            ]);

            if (!promptedAppName || !stylingFramework) {
                exit(0);
            }

            createNewApp(promptedAppName, stylingFramework, 'content-block');
        }
    });

/**
 * @deprecated `block create` and `theme create` will be removed in version 4.0 in favour of `create`
 */
for (const appType of ['block', 'theme']) {
    cli.command(
        `${appType} create [appName]`,
        `[deprecated: use 'create' instead] create a ${appType} app locally`,
    ).action((appName: string) => createNewApp(appName, 'css-modules', 'content-block'));
}

cli.help();
cli.version(pkg.version);

const mergeOldBlockThemeCommands = (cliArgs: string[]) => {
    const oldCommandIndex = cliArgs.findIndex((value) => value === 'block' || value === 'theme');
    if (
        oldCommandIndex !== -1 &&
        (cliArgs[oldCommandIndex + 1] === 'serve' ||
            cliArgs[oldCommandIndex + 1] === 'deploy' ||
            cliArgs[oldCommandIndex + 1] === 'create')
    ) {
        cliArgs[oldCommandIndex] = `${cliArgs[oldCommandIndex]} ${cliArgs[oldCommandIndex + 1]}`;
        cliArgs.splice(oldCommandIndex + 1, 1);
    }

    return cliArgs;
};

cli.parse(mergeOldBlockThemeCommands(process.argv));
