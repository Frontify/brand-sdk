/* (c) Copyright Frontify Ltd., all rights reserved. */

import { join } from 'node:path';

import open from 'open';
import pc from 'picocolors';
import { escapePath, glob } from 'tinyglobby';

import { type HttpClientError } from '../errors/HttpClientError';
import {
    type CompilerOptions,
    Configuration,
    HttpClient,
    Logger,
    getUser,
    promiseExec,
    reactiveJson,
    readFileAsBase64,
    readFileLinesAsArray,
} from '../utils/index';
import {
    type MarketplaceManifest,
    platformAppManifestSchemaV1,
    verifyManifest,
    verifyManifestOnServer,
} from '../utils/verifyManifest';

type Options = {
    dryRun?: boolean;
    noVerify?: boolean;
    openInBrowser?: boolean;
    token?: string;
    instance?: string;
};

const makeFilesDict = async (folderPath: string, ignoreGlobs?: string[]) => {
    const folderFilenames = await glob('**', {
        cwd: folderPath,
        ignore: ignoreGlobs,
        dot: true,
        expandDirectories: false,
    });

    return folderFilenames.reduce((stack, filename) => {
        stack[`/${filename}`] = readFileAsBase64(join(folderPath, filename));
        return stack;
    }, {});
};

const BUILD_FILE_BLOCK_LIST = ['**/*.*.map'];
const SOURCE_FILE_BLOCK_LIST = [
    '.git',
    'node_modules',
    'dist',
    '.vscode',
    '.idea',
    '.eslintignore',
    '.prettierignore',
    'README.md',
    '.DS_Store',
    '**/*.graphql',
];

export const resolveCredentials = (token?: string, instance?: string) => {
    const instanceUrl = instance || Configuration.get('instanceUrl');
    const accessToken = token || Configuration.get('tokens.access_token');

    if (!accessToken || !instanceUrl) {
        Logger.error(
            `You are currently not logged in. You can use the command ${pc.bold(
                'frontify-cli login',
            )} to log in, or pass --token=<token> --instance=<instance> to the deploy command.`,
        );
        process.exit(-1);
    }

    return { instanceUrl, accessToken };
};

export const verifyCode = async (noVerify: boolean) => {
    if (noVerify) {
        return;
    }

    Logger.info('Performing type checks...');
    await promiseExec('npx tsc --noEmit');

    const eslintConfigFiles = await glob(
        ['.eslintrc', '.eslintrc.{js,cjs,mjs,json,yaml,yml}', 'eslint.config.{js,cjs,mjs,ts,cts,mts}'],
        { dot: true, expandDirectories: false },
    );

    if (eslintConfigFiles.length === 0) {
        Logger.info('Eslint config file not found, skipping eslint checks...');
        return;
    }

    Logger.info('Performing eslint checks...');
    await promiseExec('npx eslint src');
};

export const collectFiles = async (projectPath: string, distPath: string) => {
    const gitignoreEntries = readFileLinesAsArray(join(projectPath, '.gitignore')).filter(
        (entry) => entry !== 'manifest.json',
    );

    // Patterns are relative to the project root, so a leading slash (root-anchored in .gitignore) is dropped.
    const sourceFilesToIgnore = [...gitignoreEntries, ...SOURCE_FILE_BLOCK_LIST].map((path) => {
        const relativePath = path.replace(/^\/+/, '');
        return relativePath.includes('*') ? relativePath : escapePath(relativePath);
    });

    const packageJsonContent = reactiveJson<{ dependencies?: Record<string, string> }>(
        join(projectPath, 'package.json'),
    );

    return {
        build_files: await makeFilesDict(join(projectPath, distPath), BUILD_FILE_BLOCK_LIST),
        source_files: await makeFilesDict(projectPath, sourceFilesToIgnore),
        dependencies: packageJsonContent?.dependencies || {},
    };
};

export const validateManifestOnServer = async (
    instanceUrl: string,
    accessToken: string,
    appType: 'content-block' | 'theme',
    manifestContent: MarketplaceManifest,
): Promise<void> => {
    Logger.info('Validating the manifest against the Frontify Marketplace...');
    const httpClient = new HttpClient(instanceUrl);
    try {
        const result = await verifyManifestOnServer(httpClient, accessToken, appType, manifestContent);
        if (!result.data.valid) {
            Logger.error('The manifest is invalid:', result.data.error);
            process.exit(-1);
        }
    } catch (error) {
        Logger.error(
            'An error occurred while validating the manifest:',
            (error as HttpClientError).responseBody?.error || (error as Error).message,
        );
        process.exit(-1);
    }
};

export const handleDeployError = (error: unknown): never => {
    if (typeof error === 'string') {
        Logger.error('The deployment has failed and was aborted due to an error:', error);
    } else if (error instanceof Error) {
        Logger.error('The deployment has failed and was aborted due to an error:', error.message);
    } else {
        Logger.error('The deployment has failed and was aborted due to an unknown error.');
    }
    process.exit(-1);
};

export const createDeployment = async (
    entryFile: string,
    distPath: string,
    { dryRun = false, noVerify = false, openInBrowser = false, token, instance }: Options,
    compile: ({ projectPath, entryFile, outputName }: CompilerOptions) => Promise<unknown>,
): Promise<void> => {
    try {
        const { instanceUrl, accessToken } = resolveCredentials(token, instance);

        if (dryRun) {
            Logger.info(pc.blue('Dry run: enabled'));
        } else {
            const user = await getUser(instanceUrl, token);
            if (user) {
                Logger.info(`You are logged in as ${user.name} (${instanceUrl}).`);
            } else {
                return;
            }
        }

        const projectPath = process.cwd();
        const manifestContent = reactiveJson<MarketplaceManifest>(join(projectPath, 'manifest.json'));
        const { appId } =
            manifestContent.appType === 'platform-app'
                ? verifyManifest(manifestContent, platformAppManifestSchemaV1)
                : manifestContent;

        // Content block was the first app type that was introduced, thus there might be manifests without an explicit appType.
        // This is why we treat manifests without an explicit appType as 'content-block'.
        const appType = manifestContent.appType ?? 'content-block';

        if (appType === 'content-block' || appType === 'theme') {
            await validateManifestOnServer(instanceUrl, accessToken, appType, manifestContent);
        }

        await verifyCode(noVerify);

        try {
            await compile({ projectPath, entryFile, outputName: appId });
        } catch (error) {
            Logger.error(error as string);
            process.exit(-1);
        }

        const request = await collectFiles(projectPath, distPath);

        if (dryRun) {
            Logger.success('The command has been executed without any issue.');
            process.exit(0);
        }

        Logger.info('Sending the files to Frontify Marketplace...');

        const httpClient = new HttpClient(instanceUrl);

        try {
            await httpClient.put(`/api/marketplace/app/${appId}`, request, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            Logger.success('The new version has been pushed.');

            if (openInBrowser) {
                Logger.info('Opening the Frontify Marketplace page...');
                await open(`https://${instanceUrl}/marketplace/apps/${appId}`);
            }
        } catch (error) {
            Logger.error('An error occurred while deploying:', (error as HttpClientError).responseBody.error);
            process.exit(-1);
        }
    } catch (error) {
        handleDeployError(error);
    }
};
