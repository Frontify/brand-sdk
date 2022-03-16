import fastGlob from 'fast-glob';
import Logger from '../utils/logger';
import open from 'open';
import { UserInfo, getUser } from '../utils/user';
import { Bundler, compile } from '../utils/compile';
import { reactiveJson } from '../utils/reactiveJson';
import { join } from 'path';
import { readFileAsBase64, readFileLinesAsArray } from '../utils/file';
import { HttpClient } from '../utils/httpClient';
import { promiseExec } from '../utils/promiseExec';
import { blue } from 'chalk';
import { Configuration } from '../utils/configuration';
import { Headers } from 'node-fetch';

interface Options {
    dryRun?: boolean;
    openInBrowser?: boolean;
    bundler?: Bundler;
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
    surface: string,
    projectPath: string,
    entryFileNames: string[],
    distPath: string,
    { dryRun = false, openInBrowser = false, bundler }: Options
): Promise<void> => {
    try {
        let user: UserInfo | undefined;
        if (!dryRun) {
            user = await getUser(instanceUrl);
            user && Logger.info(`You are logged in as ${user.name} (${instanceUrl}).`);
        }

        if (user || dryRun) {
            dryRun && Logger.info(blue('Dry run: enabled'));

            const manifest = reactiveJson<Manifest>(join(process.cwd(), 'manifest.json'));

            // Logger.info('Performing type checks...');
            // await promiseExec(`cd ${projectPath} && ./node_modules/.bin/tsc --noEmit`);

            // Logger.info('Performing eslint checks...');
            // await promiseExec(`cd ${projectPath} && ./node_modules/.bin/eslint src`);

            // Logger.info('Running security checks...');
            // await promiseExec(`cd ${projectPath} && npm audit --audit-level=high`);

            Logger.info('Compiling code...');
            const fullProjectPath = join(process.cwd(), projectPath);
            await compile(fullProjectPath, entryFileNames, `${surface}_${manifest.appId}`, {
                distPath: join(fullProjectPath, distPath),
                env: {
                    NODE_ENV: 'production',
                },
                bundler,
            });

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
            };

            if (!dryRun) {
                Logger.info('Sending the files to Frontify Marketplace...');

                const httpClient = new HttpClient(instanceUrl);

                const accessToken = Configuration.get('tokens.access_token');
                const headers = new Headers({ Authorization: `Bearer ${accessToken}` });

                await httpClient.put(`/api/marketplace-app/apps/${manifest.appId}`, request, { headers });

                Logger.success('The new version has been pushed.');

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
