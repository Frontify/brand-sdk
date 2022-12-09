/* (c) Copyright Frontify Ltd., all rights reserved. */

import { cac } from 'cac';
import prompts from 'prompts';
import { exit } from 'node:process';
import { join } from 'node:path';

import { createDeployment, createDevelopmentServer, createNewContentBlock, loginUser, logoutUser } from './commands';
import { getValidInstanceUrl, isValidName } from './utils';
import pkg from '../package.json';

const cli = cac(pkg.name.split('/')[1]);

cli.command('login [instanceUrl]', 'log in to a Frontify instance')
    .option('-i, --instance [instanceUrl]', '[string] url of the Frontify instance')
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
    .action(async (options) => {
        await createDevelopmentServer(options.entryPath, options.port, options.allowExternal);
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
            await createDeployment(options.entryPath, options.outDir, {
                dryRun: options.dryRun,
                noVerify: options.noVerify,
                openInBrowser: options.open,
            });
        });
}

cli.command('deploy', 'deploy the app to the marketplace')
    .option('-e, --entryPath <entryPath>', '[string] path to the entry file', { default: join('src', 'index.ts') })
    .option('-o, --outDir <outDir>', '[string] path to the output directory', { default: 'dist' })
    .option('--dryRun, --dry-run', '[boolean] enable the dry run mode', { default: false })
    .option('--noVerify, --no-verify', '[boolean] disable the linting and typechecking', { default: false })
    .option('--open', '[boolean] open the marketplace app page', { default: false })
    .action(async (options) => {
        await createDeployment(options.entryPath, options.outDir, {
            dryRun: options.dryRun,
            noVerify: options.noVerify,
            openInBrowser: options.open,
        });
    });

cli.command('create [appName]', 'create a new marketplace app').action(async (appName: string) => {
    appName && prompts.inject([appName, undefined]);

    const { promptedAppName, stylingFramework } = await prompts([
        {
            type: 'text',
            name: 'promptedAppName',
            message: 'Enter your app name',
            initial: 'my-frontify-app',
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

    createNewContentBlock(promptedAppName, stylingFramework);
});

/**
 * @deprecated `block create` and `theme create` will be removed in version 4.0 in favour of `create`
 */
for (const appType of ['block', 'theme']) {
    cli.command(
        `${appType} create [appName]`,
        `[deprecated: use 'create' instead] create a ${appType} app locally`,
    ).action((appName: string) => createNewContentBlock(appName, 'css-modules'));
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
