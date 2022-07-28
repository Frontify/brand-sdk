/* (c) Copyright Frontify Ltd., all rights reserved. */

import colors from 'colors/safe';
import fastGlob from 'fast-glob';
import { Headers } from 'node-fetch';
import open from 'open';
import { join } from 'path';
import CompilationFailedError from '../errors/CompilationFailedError';
import { compile } from '../utils/compiler';
import { Configuration } from '../utils/configuration';
import { readFileAsBase64, readFileLinesAsArray } from '../utils/file';
import { HttpClient } from '../utils/httpClient';
import Logger from '../utils/logger';
import { promiseExec } from '../utils/promiseExec';
import { reactiveJson } from '../utils/reactiveJson';
import { UserInfo, getUser } from '../utils/user';

interface Options {
    dryRun?: boolean;
    noVerify?: boolean;
    openInBrowser?: boolean;
}

const makeFilesDict = async (glob: string, ignoreGlobs?: string[]) => {
    const folderFiles = await fastGlob(join(glob, '**'), { ignore: ignoreGlobs });

    const folderFilenames = folderFiles.map((filePath) => filePath.replace(`${glob}/`, ''));

    return folderFilenames.reduce((stack, filename, index) => {
        stack[`/${filename}`] = readFileAsBase64(folderFiles[index]);
        return stack;
    }, {});
};

export const createDeployment = async (
    instanceUrl: string,
    projectPath: string,
    entryFileName: string,
    distPath: string,
    { dryRun = false, noVerify = false, openInBrowser = false }: Options
): Promise<void> => {
    try {
        let user: UserInfo | undefined;
        if (!dryRun) {
            user = await getUser(instanceUrl);
            user && Logger.info(`You are logged in as ${user.name} (${instanceUrl}).`);
        }

        if (user || dryRun) {
            dryRun && Logger.info(colors.blue('Dry run: enabled'));

            const fullProjectPath = join(process.cwd(), projectPath);
            const manifest = reactiveJson<Manifest>(join(process.cwd(), 'manifest.json'));

            if (!noVerify) {
                Logger.info('Performing type checks...');
                await promiseExec(`cd ${fullProjectPath} && ./node_modules/.bin/tsc --noEmit`);

                Logger.info('Performing eslint checks...');
                await promiseExec(`cd ${fullProjectPath} && ./node_modules/.bin/eslint src`);
            }

            Logger.info('Compiling code...');
            try {
                await compile(fullProjectPath, entryFileName, 'DevCustomBlock');
            } catch (error) {
                throw new CompilationFailedError(error as string);
            }

            const BUILD_FILE_BLOCK_LIST = ['**/*.*.map'];
            const buildFilesToIgnore = BUILD_FILE_BLOCK_LIST.map((path) => join(projectPath, path));

            const SOURCE_FILE_BLOCK_LIST = ['.git', 'node_modules', 'dist', '.vscode', '.idea', 'README.md'];
            const gitignoreEntries = readFileLinesAsArray(join(projectPath, '.gitignore'));
            const sourceFilesToIgnore = [...gitignoreEntries, ...SOURCE_FILE_BLOCK_LIST].map((path) =>
                join(projectPath, path)
            );

            const request = {
                build_files: await makeFilesDict(join(projectPath, distPath), buildFilesToIgnore),
                source_files: await makeFilesDict(join(projectPath), sourceFilesToIgnore),
                // TODO: expose version? => version: 2,
            };

            if (!dryRun) {
                Logger.info('Sending the files to Frontify Marketplace...');

                const httpClient = new HttpClient(instanceUrl);

                const accessToken = Configuration.get('tokens.access_token');
                const headers = new Headers({ Authorization: `Bearer ${accessToken}` });

                try {
                    await httpClient.put(`/api/marketplace/app/${manifest.appId}`, request, {
                        headers,
                    });

                    Logger.success('The new version has been pushed.');
                } catch (error) {
                    Logger.error('Failed to push the new version:', error as string);
                }

                if (openInBrowser) {
                    Logger.info('Opening the Frontify Marketplace page...');
                    await open(`https://${instanceUrl}/marketplace/apps/${manifest.appId}`);
                }
            } else {
                Logger.success('The command has been executed without any issue.');
            }
        }
    } catch (error) {
        Logger.error('The deployment has failed and was aborted.', error as string);
    }
};
