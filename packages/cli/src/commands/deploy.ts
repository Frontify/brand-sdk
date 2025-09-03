/* (c) Copyright Frontify Ltd., all rights reserved. */

import { join } from 'node:path';

import fastGlob from 'fast-glob';
import open from 'open';
import pc from 'picocolors';

import { type HttpClientError } from '../errors/HttpClientError';
import {
    type CompilerOptions,
    Configuration,
    HttpClient,
    Logger,
    type UserInfo,
    getUser,
    promiseExec,
    reactiveJson,
    readFileAsBase64,
    readFileLinesAsArray,
} from '../utils/index';
import { platformAppManifestSchemaV1, verifyManifest } from '../utils/verifyManifest';

type Options = {
    dryRun?: boolean;
    noVerify?: boolean;
    openInBrowser?: boolean;
    token?: string;
    instance?: string;
};

export type AppManifest = {
    appId: string;
    appType?: string;
    metadata?: {
        version?: number;
    };
    experimental?: boolean;
};

const makeFilesDict = async (glob: string, ignoreGlobs?: string[]) => {
    const folderFiles = await fastGlob(`${fastGlob.convertPathToPattern(glob)}/**`, { ignore: ignoreGlobs, dot: true });
    const folderFilenames = folderFiles.map((filePath) => filePath.replace(`${glob}/`, ''));

    return folderFilenames.reduce((stack, filename, index) => {
        stack[`/${filename}`] = readFileAsBase64(folderFiles[index]);
        return stack;
    }, {});
};

const BUILD_FILE_BLOCK_LIST = ['**/*.*.map'];
const SOURCE_FILE_BLOCK_LIST = ['.git', 'node_modules', 'dist', '.vscode', '.idea', 'README.md', '.DS_Store'];

export const createDeployment = async (
    entryFile: string,
    distPath: string,
    { dryRun = false, noVerify = false, openInBrowser = false, token, instance }: Options,
    compile: ({ projectPath, entryFile, outputName }: CompilerOptions) => Promise<unknown>,
): Promise<void> => {
    try {
        let user: UserInfo | undefined;
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

        if (!dryRun) {
            user = await getUser(instanceUrl, token);
            if (user) {
                Logger.info(`You are logged in as ${user.name} (${instanceUrl}).`);
            }
        }

        if (user || dryRun) {
            if (dryRun) {
                Logger.info(pc.blue('Dry run: enabled'));
            }

            const projectPath = process.cwd();
            const manifestContent = reactiveJson<AppManifest>(join(projectPath, 'manifest.json'));
            const { appId } =
                manifestContent.appType === 'platform-app'
                    ? verifyManifest(manifestContent, platformAppManifestSchemaV1)
                    : manifestContent;

            if (!noVerify) {
                Logger.info('Performing type checks...');
                await promiseExec('npx tsc --noEmit');

                Logger.info('Performing eslint checks...');
                await promiseExec('npx eslint src');
            }

            try {
                await compile({ projectPath, entryFile, outputName: appId });
            } catch (error) {
                Logger.error(error as string);
                process.exit(-1);
            }

            const buildFilesToIgnore = BUILD_FILE_BLOCK_LIST.map((path) =>
                fastGlob.convertPathToPattern(projectPath + path),
            );

            const gitignoreEntries = readFileLinesAsArray(join(projectPath, '.gitignore')).filter(
                (entry) => entry !== 'manifest.json',
            );
            const sourceFilesToIgnore = [...gitignoreEntries, ...SOURCE_FILE_BLOCK_LIST].map((path) =>
                fastGlob.convertPathToPattern(`${projectPath}/${path}`),
            );

            const request = {
                build_files: await makeFilesDict(
                    fastGlob.convertPathToPattern(`${projectPath}/${distPath}`),
                    buildFilesToIgnore,
                ),
                source_files: await makeFilesDict(fastGlob.convertPathToPattern(projectPath), sourceFilesToIgnore),
            };

            if (!dryRun) {
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
                    Logger.error('An error occured while deploying:', (error as HttpClientError).responseBody.error);
                    process.exit(-1);
                }
            } else {
                Logger.success('The command has been executed without any issue.');
                process.exit(0);
            }
        }
    } catch (error) {
        if (typeof error === 'string') {
            Logger.error('The deployment has failed and was aborted due to an error:', error);
        } else if (error instanceof Error) {
            Logger.error('The deployment has failed and was aborted due to an error:', error.message);
        } else {
            Logger.error('The deployment has failed and was aborted due to an unknown error.');
        }
        process.exit(-1);
    }
};
