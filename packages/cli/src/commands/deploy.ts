/* (c) Copyright Frontify Ltd., all rights reserved. */

import { join } from 'node:path';

import fastGlob from 'fast-glob';
import open from 'open';
import pc from 'picocolors';

import { type HttpClientError } from '../errors/HttpClientError';
import { getInstalledPackageVersion } from '../utils/getPackageVersion';
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

const SENSITIVE_FILE_PATTERNS = ['.env', '.npmrc', '.netrc'];

const PROTOCOL_PREFIXES = ['catalog:', 'workspace:', 'link:', 'file:', 'portal:'];

const isProtocolSpecifier = (specifier: string): boolean => {
    return PROTOCOL_PREFIXES.some((prefix) => specifier.startsWith(prefix));
};

export const resolveDependencyVersions = (
    dependencies: Record<string, string>,
    projectPath: string,
): Record<string, string> => {
    const resolved: Record<string, string> = {};

    for (const [name, specifier] of Object.entries(dependencies)) {
        const installedVersion = getInstalledPackageVersion(projectPath, name);

        if (installedVersion && !isProtocolSpecifier(installedVersion)) {
            resolved[name] = installedVersion;
            continue;
        }

        if (isProtocolSpecifier(specifier)) {
            Logger.warn(
                `Could not resolve version for "${name}" (specifier: "${specifier}"). ` +
                    'The package may not be installed. Omitting from deployment dependencies.',
            );
            continue;
        }

        resolved[name] = specifier;
    }

    return resolved;
};

export const warnAboutSensitiveFiles = (sourceFiles: Record<string, string>): void => {
    const sensitiveFiles = Object.keys(sourceFiles).filter((filePath) =>
        SENSITIVE_FILE_PATTERNS.some((pattern) => filePath.split('/').some((segment) => segment.startsWith(pattern))),
    );

    if (sensitiveFiles.length > 0) {
        Logger.warn(
            `Potentially sensitive files detected in source files:\n${sensitiveFiles.map((f) => `  - ${f}`).join('\n')}\n` +
                'Consider adding these to your .gitignore to prevent them from being uploaded.',
        );
    }
};

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

    Logger.info('Performing eslint checks...');
    await promiseExec('npx eslint src');
};

export const collectFiles = async (projectPath: string, distPath: string) => {
    const buildFilesToIgnore = BUILD_FILE_BLOCK_LIST.map((pattern) => {
        if (pattern.includes('*')) {
            return `${fastGlob.convertPathToPattern(projectPath)}/${pattern}`;
        }
        return fastGlob.convertPathToPattern(`${projectPath}/${pattern}`);
    });

    const gitignoreEntries = readFileLinesAsArray(join(projectPath, '.gitignore')).filter(
        (entry) => entry !== 'manifest.json',
    );

    const sourceFilesToIgnore = [...gitignoreEntries, ...SOURCE_FILE_BLOCK_LIST].map((path) => {
        if (path.includes('*')) {
            return `${projectPath}/${path}`;
        }
        return fastGlob.convertPathToPattern(`${projectPath}/${path}`);
    });

    const packageJsonContent = reactiveJson<{
        dependencies?: Record<string, string>;
        devDependencies?: Record<string, string>;
        peerDependencies?: Record<string, string>;
    }>(join(projectPath, 'package.json'));

    const resolvedDependencies = resolveDependencyVersions(packageJsonContent?.dependencies || {}, projectPath);

    const sourceFiles = await makeFilesDict(fastGlob.convertPathToPattern(projectPath), sourceFilesToIgnore);

    // Sanitize the package.json in source_files to contain resolved versions
    // instead of protocol specifiers that are invalid outside the workspace.
    // Note: packageJsonContent is a reactiveJson Proxy. We only READ from it here
    // via spread and property access. Do not mutate it directly — the Proxy's set
    // trap would write changes back to disk.
    if (sourceFiles['/package.json'] && packageJsonContent) {
        const sanitized = {
            ...packageJsonContent,
            dependencies: resolvedDependencies,
            devDependencies: resolveDependencyVersions(packageJsonContent.devDependencies || {}, projectPath),
            peerDependencies: resolveDependencyVersions(packageJsonContent.peerDependencies || {}, projectPath),
        };
        sourceFiles['/package.json'] = Buffer.from(JSON.stringify(sanitized, null, '\t')).toString('base64');
    }

    warnAboutSensitiveFiles(sourceFiles);

    const buildFiles = await makeFilesDict(
        fastGlob.convertPathToPattern(`${projectPath}/${distPath}`),
        buildFilesToIgnore,
    );

    return {
        build_files: buildFiles,
        source_files: sourceFiles,
        dependencies: resolvedDependencies,
    };
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
        const manifestContent = reactiveJson<AppManifest>(join(projectPath, 'manifest.json'));
        const { appId } =
            manifestContent.appType === 'platform-app'
                ? verifyManifest(manifestContent, platformAppManifestSchemaV1)
                : manifestContent;

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
