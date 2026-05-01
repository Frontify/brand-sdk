/* (c) Copyright Frontify Ltd., all rights reserved. */

import { join } from 'node:path';
import { exit } from 'node:process';

import { cac } from 'cac';
import prompts from 'prompts';

import pkg from '../package.json';

import {
    createDeployment,
    createDevelopmentServer,
    createDevelopmentServerForPlatformApp,
    createDevelopmentServerForTheme,
    createNewApp,
    loginUser,
    logoutUser,
    publishApp,
    verifyManifest,
    Availability,
} from './commands/index';
import FileNotFoundError from './errors/FileNotFoundError';
import {
    type CompilerOptions,
    Logger,
    compileBlock,
    compilePlatformApp,
    compileTheme,
    getValidInstanceUrl,
    isValidName,
    reactiveJson,
} from './utils/index';
import { type MarketplaceManifest } from './utils/verifyManifest';

type LoginOptions = { instance: string; port: number };
type ServeOptions = { entryPath: string; port: number; allowExternal: boolean; appType?: string };
type DeployOptions = {
    entryPath: string;
    outDir: string;
    dryRun: boolean;
    noVerify: boolean;
    open: boolean;
    appType?: string;
    instance?: string;
    token?: string;
};

const cli = cac(pkg.name.split('/')[1]);

cli.command('login [instanceUrl]', 'log in to a Frontify instance')
    .option('-i, --instance <instanceUrl>', '[string] url of the Frontify instance')
    .option('-p, --port <port>', '[number] port for the oauth service', {
        default: process.env.PORT || 5600,
    })
    .action(async (instanceUrl: string, options: LoginOptions) => {
        const computedInstanceUrl = instanceUrl || options.instance || process.env.INSTANCE_URL;
        if (computedInstanceUrl) {
            prompts.inject([computedInstanceUrl]);
        }

        const { promptedInstanceUrl } = (await prompts([
            {
                type: 'text',
                name: 'promptedInstanceUrl',
                message: 'Enter a Frontify instance URL',
                initial: 'instanceName.frontify.com',
                validate: (value: string) => (value.trim() === '' ? 'You need to enter a valid URL.' : true),
            },
        ])) as { promptedInstanceUrl: string };

        if (!promptedInstanceUrl) {
            exit(0);
        }

        const parsedInstanceUrl = getValidInstanceUrl(promptedInstanceUrl);

        await loginUser(parsedInstanceUrl, options.port);
    });

cli.command('logout', 'log out of an instance').action(logoutUser);

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
    .action(async (options: ServeOptions) => {
        let manifest: MarketplaceManifest | undefined;
        try {
            manifest = reactiveJson<MarketplaceManifest>(join(process.cwd(), 'manifest.json'));
        } catch (error) {
            if (!(error instanceof FileNotFoundError)) {
                throw error;
            }
        }
        const appType = options.appType || manifest?.appType;

        if (appType === 'platform-app') {
            await createDevelopmentServerForPlatformApp(options.entryPath, options.port);
        } else if (appType === 'theme') {
            await createDevelopmentServerForTheme(options.entryPath, options.port, options.allowExternal);
        } else {
            await createDevelopmentServer(options.entryPath, options.port, options.allowExternal);
        }
    });

cli.command('deploy', 'deploy the app to the marketplace')
    .option('-e, --entryPath <entryPath>', '[string] path to the entry file', { default: join('src', 'index.ts') })
    .option('-o, --outDir <outDir>', '[string] path to the output directory', { default: 'dist' })
    .option('--dryRun, --dry-run', '[boolean] enable the dry run mode', { default: false })
    .option('--noVerify, --no-verify', '[boolean] disable the linting and typechecking', { default: false })
    .option('--open', '[boolean] open the marketplace app page', { default: false })
    .option('--appType [appType], --app-type', '[string] specify app type. Overrides manifest values')
    .option('-i, --instance <instanceUrl>', '[string] url of the Frontify instance')
    .option('-t, --token <accessToken>', '[string] the access token')
    .action(async (options: DeployOptions) => {
        const manifest = reactiveJson<MarketplaceManifest>(join(process.cwd(), 'manifest.json'));
        const appType = options.appType || manifest.appType || 'content-block';

        const compilers: Record<string, (options: CompilerOptions) => Promise<unknown>> = {
            'content-block': compileBlock,
            'platform-app': compilePlatformApp,
            theme: compileTheme,
        };

        const compiler = compilers[appType ?? ''];
        if (!compiler) {
            throw new Error(`Unknown app type "${appType}". Expected one of: ${Object.keys(compilers).join(', ')}`);
        }

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
            compiler,
        );
    });

cli.command('verify-manifest', 'verify the app manifest against the Frontify marketplace')
    .option('--appType [appType], --app-type', '[string] specify app type. Overrides manifest values')
    .option('-i, --instance <instanceUrl>', '[string] url of the Frontify instance')
    .option('-t, --token <accessToken>', '[string] the access token')
    .action(async (options: { appType?: string; instance?: string; token?: string }) => {
        await verifyManifest({
            appType: options.appType,
            instance: options.instance,
            token: options.token,
        });
    });

cli.command('publish', 'publish the app to the marketplace')
    .option('--releaseNotes, --release-notes <releaseNotes>', '[string] release notes for the publish')
    .option(
        '--availability [availability]',
        `[string] availability of the app (${Object.values(Availability).join(', ')})`,
        { default: Availability.PRIVATE },
    )
    .option('-i, --instance <instanceUrl>', '[string] url of the Frontify instance')
    .option('-t, --token <accessToken>', '[string] the access token')
    .action(async (options) => {
        if (!options.releaseNotes) {
            Logger.error('Release notes are required. Use --releaseNotes="Your release notes".');
            process.exit(-1);
        }

        await publishApp({
            releaseNotes: options.releaseNotes,
            availability: options.availability,
            token: options.token,
            instance: options.instance,
        });
    });

cli.command('create [appName]', 'create a new marketplace app').action(async (appName: string) => {
    const { promptedAppName, stylingFramework, appType } = (await prompts([
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
    ])) as { promptedAppName: string; stylingFramework: string; appType: string };

    if (!promptedAppName || !stylingFramework || !appType) {
        exit(0);
    }

    createNewApp(promptedAppName, stylingFramework, appType);
});

cli.help();
cli.version(pkg.version);

cli.parse(process.argv);
