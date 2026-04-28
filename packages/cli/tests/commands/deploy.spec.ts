/* (c) Copyright Frontify Ltd., all rights reserved. */

import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, beforeEach, describe, expect, test, vi, type MockInstance } from 'vitest';

import { Configuration } from '../../src/utils/configuration';
import { Logger } from '../../src/utils/logger';

import type * as GetPackageVersionModule from '../../src/utils/getPackageVersion';
import type * as UtilsModule from '../../src/utils/index';

const promiseExecMock = vi.fn().mockResolvedValue('');
const getInstalledPackageVersionMock = vi.fn();

vi.mock('../../src/utils/index', async (importOriginal) => {
    const original = await importOriginal<typeof UtilsModule>();
    return { ...original, promiseExec: promiseExecMock };
});

vi.mock('../../src/utils/getPackageVersion', async (importOriginal) => {
    const original = await importOriginal<typeof GetPackageVersionModule>();
    return {
        ...original,
        getInstalledPackageVersion: getInstalledPackageVersionMock,
    };
});

const {
    collectFiles,
    handleDeployError,
    resolveCredentials,
    resolveDependencyVersions,
    verifyCode,
    warnAboutSensitiveFiles,
} = await import('../../src/commands/deploy');

describe('Deploy command helpers', () => {
    describe('resolveCredentials', () => {
        let oldTokens: unknown;
        let oldInstanceUrl: unknown;
        let exitSpy: MockInstance;
        let consoleErrorSpy: MockInstance;

        beforeEach(() => {
            oldTokens = Configuration.get('tokens') || {};
            oldInstanceUrl = Configuration.get('instanceUrl') || '';
            exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);
            consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        });

        afterEach(() => {
            Configuration.set('tokens', oldTokens);
            Configuration.set('instanceUrl', oldInstanceUrl);
            exitSpy.mockRestore();
            consoleErrorSpy.mockRestore();
        });

        test('should return token and instance when passed directly', () => {
            const result = resolveCredentials('my-token', 'my-instance.frontify.com');
            expect(result).toEqual({
                accessToken: 'my-token',
                instanceUrl: 'my-instance.frontify.com',
            });
        });

        test('should fall back to stored configuration', () => {
            Configuration.set('tokens', { access_token: 'stored-token' });
            Configuration.set('instanceUrl', 'stored.frontify.com');

            const result = resolveCredentials();
            expect(result).toEqual({
                accessToken: 'stored-token',
                instanceUrl: 'stored.frontify.com',
            });
        });

        test('should prefer passed arguments over stored configuration', () => {
            Configuration.set('tokens', { access_token: 'stored-token' });
            Configuration.set('instanceUrl', 'stored.frontify.com');

            const result = resolveCredentials('passed-token', 'passed.frontify.com');
            expect(result).toEqual({
                accessToken: 'passed-token',
                instanceUrl: 'passed.frontify.com',
            });
        });

        test('should exit when no token is available', () => {
            Configuration.delete('tokens');
            Configuration.set('instanceUrl', 'some.frontify.com');

            resolveCredentials();
            expect(exitSpy).toHaveBeenCalledWith(-1);
        });

        test('should exit when no instance URL is available', () => {
            Configuration.set('tokens', { access_token: 'some-token' });
            Configuration.delete('instanceUrl');

            resolveCredentials();
            expect(exitSpy).toHaveBeenCalledWith(-1);
        });
    });

    describe('verifyCode', () => {
        beforeEach(() => {
            promiseExecMock.mockClear();
        });

        test('should skip verification when noVerify is true', async () => {
            await verifyCode(true);

            expect(promiseExecMock).not.toHaveBeenCalled();
        });

        test('should run tsc and eslint when noVerify is false', async () => {
            console.log = vi.fn();

            await verifyCode(false);

            expect(promiseExecMock).toHaveBeenCalledTimes(2);
            expect(promiseExecMock).toHaveBeenCalledWith('npx tsc --noEmit');
            expect(promiseExecMock).toHaveBeenCalledWith('npx eslint src');
        });
    });

    describe('resolveDependencyVersions', () => {
        let warnSpy: MockInstance;

        beforeEach(() => {
            getInstalledPackageVersionMock.mockReset();
            warnSpy = vi.spyOn(Logger, 'warn').mockImplementation(() => {});
        });

        afterEach(() => {
            warnSpy.mockRestore();
        });

        test('should resolve catalog: specifier to installed version', () => {
            getInstalledPackageVersionMock.mockReturnValue('18.2.0');

            const result = resolveDependencyVersions({ react: 'catalog:' }, '/project');

            expect(result).toEqual({ react: '18.2.0' });
            expect(getInstalledPackageVersionMock).toHaveBeenCalledWith('/project', 'react');
        });

        test('should resolve catalog:name specifier to installed version', () => {
            getInstalledPackageVersionMock.mockReturnValue('19.1.0');

            const result = resolveDependencyVersions({ react: 'catalog:react19' }, '/project');

            expect(result).toEqual({ react: '19.1.0' });
        });

        test('should resolve workspace:* specifier to installed version', () => {
            getInstalledPackageVersionMock.mockReturnValue('1.0.0');

            const result = resolveDependencyVersions({ '@acme/shared': 'workspace:*' }, '/project');

            expect(result).toEqual({ '@acme/shared': '1.0.0' });
        });

        test('should resolve workspace:^ specifier to installed version', () => {
            getInstalledPackageVersionMock.mockReturnValue('2.3.4');

            const result = resolveDependencyVersions({ '@acme/utils': 'workspace:^' }, '/project');

            expect(result).toEqual({ '@acme/utils': '2.3.4' });
        });

        test('should omit catalog: specifier when package is not installed', () => {
            getInstalledPackageVersionMock.mockReturnValue(undefined);

            const result = resolveDependencyVersions({ react: 'catalog:' }, '/project');

            expect(result).toEqual({});
        });

        test('should omit workspace: specifier when package is not installed', () => {
            getInstalledPackageVersionMock.mockReturnValue(undefined);

            const result = resolveDependencyVersions({ '@acme/shared': 'workspace:*' }, '/project');

            expect(result).toEqual({});
        });

        test('should warn when omitting unresolvable protocol specifier', () => {
            getInstalledPackageVersionMock.mockReturnValue(undefined);

            resolveDependencyVersions({ react: 'catalog:' }, '/project');

            expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Could not resolve version for "react"'));
        });

        test('should use raw specifier for normal semver ranges when not installed', () => {
            getInstalledPackageVersionMock.mockReturnValue(undefined);

            const result = resolveDependencyVersions({ react: '^18.0.0' }, '/project');

            expect(result).toEqual({ react: '^18.0.0' });
        });

        test('should prefer installed version over raw specifier', () => {
            getInstalledPackageVersionMock.mockReturnValue('18.2.0');

            const result = resolveDependencyVersions({ react: '^18.0.0' }, '/project');

            expect(result).toEqual({ react: '18.2.0' });
        });

        test('should handle mixed dependencies correctly', () => {
            getInstalledPackageVersionMock.mockImplementation((_root: string, name: string) => {
                if (name === 'react') {
                    return '18.2.0';
                }
                if (name === '@acme/shared') {
                    return '1.5.0';
                }
                return undefined;
            });

            const result = resolveDependencyVersions(
                {
                    react: 'catalog:',
                    '@acme/shared': 'workspace:*',
                    lodash: '^4.17.21',
                    '@acme/missing': 'workspace:^',
                },
                '/project',
            );

            expect(result).toEqual({
                react: '18.2.0',
                '@acme/shared': '1.5.0',
                lodash: '^4.17.21',
            });
        });

        test('should handle link: specifier like workspace:', () => {
            getInstalledPackageVersionMock.mockReturnValue(undefined);

            const result = resolveDependencyVersions({ mylib: 'link:../mylib' }, '/project');

            expect(result).toEqual({});
        });

        test('should handle file: specifier like workspace:', () => {
            getInstalledPackageVersionMock.mockReturnValue(undefined);

            const result = resolveDependencyVersions({ mylib: 'file:../mylib' }, '/project');

            expect(result).toEqual({});
        });

        test('should handle empty dependencies', () => {
            const result = resolveDependencyVersions({}, '/project');

            expect(result).toEqual({});
        });

        test('should omit unknown protocol specifiers (portal:)', () => {
            getInstalledPackageVersionMock.mockReturnValue(undefined);

            const result = resolveDependencyVersions({ mylib: 'portal:../mylib' }, '/project');

            expect(result).toEqual({});
        });

        test('should discard installed version when it is itself a protocol specifier', () => {
            getInstalledPackageVersionMock.mockReturnValue('catalog:');

            const result = resolveDependencyVersions({ react: 'catalog:' }, '/project');

            expect(result).toEqual({});
        });
    });

    describe('warnAboutSensitiveFiles', () => {
        let warnSpy: MockInstance;

        beforeEach(() => {
            warnSpy = vi.spyOn(Logger, 'warn').mockImplementation(() => {});
        });

        afterEach(() => {
            warnSpy.mockRestore();
        });

        test('should warn about .env files', () => {
            warnAboutSensitiveFiles({
                '/src/index.ts': 'base64',
                '/.env': 'base64',
            });

            expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('.env'));
        });

        test('should warn about .npmrc files', () => {
            warnAboutSensitiveFiles({
                '/src/index.ts': 'base64',
                '/.npmrc': 'base64',
            });

            expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('.npmrc'));
        });

        test('should warn about .env.local files', () => {
            warnAboutSensitiveFiles({
                '/src/index.ts': 'base64',
                '/.env.local': 'base64',
            });

            expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('.env.local'));
        });

        test('should warn about .netrc files', () => {
            warnAboutSensitiveFiles({
                '/src/index.ts': 'base64',
                '/.netrc': 'base64',
            });

            expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('.netrc'));
        });

        test('should not warn when no sensitive files detected', () => {
            warnAboutSensitiveFiles({
                '/src/index.ts': 'base64',
                '/package.json': 'base64',
            });

            expect(warnSpy).not.toHaveBeenCalled();
        });
    });

    describe('collectFiles', () => {
        let tempDir: string;

        beforeEach(() => {
            tempDir = join(tmpdir(), `cli-test-${Date.now()}`);
            mkdirSync(tempDir, { recursive: true });
            mkdirSync(join(tempDir, 'dist'), { recursive: true });
            mkdirSync(join(tempDir, 'src'), { recursive: true });

            writeFileSync(join(tempDir, 'package.json'), JSON.stringify({ dependencies: { react: '18.0.0' } }));
            writeFileSync(join(tempDir, '.gitignore'), 'node_modules\n.env\n');
            writeFileSync(join(tempDir, 'dist', 'index.js'), 'console.log("built")');
            writeFileSync(join(tempDir, 'dist', 'index.js.map'), '{"mappings":""}');
            writeFileSync(join(tempDir, 'src', 'index.ts'), 'console.log("source")');

            getInstalledPackageVersionMock.mockReset();
        });

        afterEach(() => {
            rmSync(tempDir, { recursive: true, force: true });
        });

        test('should collect build files excluding source maps', async () => {
            getInstalledPackageVersionMock.mockReturnValue('18.2.0');

            const result = await collectFiles(tempDir, 'dist');

            expect(result.build_files).toHaveProperty('/index.js');
            expect(result.build_files).not.toHaveProperty('/index.js.map');
        });

        test('should resolve dependencies to installed versions', async () => {
            getInstalledPackageVersionMock.mockReturnValue('18.2.0');

            const result = await collectFiles(tempDir, 'dist');

            expect(result.dependencies).toEqual({ react: '18.2.0' });
        });

        test('should resolve catalog: dependencies in package.json', async () => {
            writeFileSync(
                join(tempDir, 'package.json'),
                JSON.stringify({ dependencies: { react: 'catalog:', lodash: '^4.17.21' } }),
            );
            getInstalledPackageVersionMock.mockImplementation((_root: string, name: string) => {
                if (name === 'react') {
                    return '18.2.0';
                }
                if (name === 'lodash') {
                    return '4.17.21';
                }
                return undefined;
            });

            const result = await collectFiles(tempDir, 'dist');

            expect(result.dependencies).toEqual({ react: '18.2.0', lodash: '4.17.21' });
        });

        test('should return empty dependencies when package.json has none', async () => {
            writeFileSync(join(tempDir, 'package.json'), JSON.stringify({}));

            const result = await collectFiles(tempDir, 'dist');

            expect(result.dependencies).toEqual({});
        });

        test('should exclude gitignored and blocklisted paths from source files', async () => {
            mkdirSync(join(tempDir, 'node_modules'), { recursive: true });
            writeFileSync(join(tempDir, 'node_modules', 'dep.js'), 'module.exports = {}');

            const result = await collectFiles(tempDir, 'dist');

            const sourceFilePaths = Object.keys(result.source_files);
            expect(sourceFilePaths.some((p) => p.includes('node_modules'))).toBe(false);
        });

        test('should sanitize package.json in source_files with resolved versions', async () => {
            writeFileSync(
                join(tempDir, 'package.json'),
                JSON.stringify({ name: 'my-app', dependencies: { react: 'catalog:' } }),
            );
            getInstalledPackageVersionMock.mockReturnValue('18.2.0');

            const result = await collectFiles(tempDir, 'dist');

            const pkgJsonBase64: string = result.source_files['/package.json'] ?? '';
            const decoded = JSON.parse(Buffer.from(pkgJsonBase64, 'base64').toString('utf8')) as {
                name: string;
                dependencies: Record<string, string>;
            };
            expect(decoded.dependencies).toEqual({ react: '18.2.0' });
            expect(decoded.name).toEqual('my-app');
        });

        test('should sanitize devDependencies and peerDependencies in source_files', async () => {
            writeFileSync(
                join(tempDir, 'package.json'),
                JSON.stringify({
                    name: 'my-app',
                    dependencies: { react: '^18.0.0' },
                    devDependencies: { typescript: 'catalog:' },
                    peerDependencies: { '@frontify/app-bridge': 'workspace:*' },
                }),
            );
            getInstalledPackageVersionMock.mockImplementation((_root: string, name: string) => {
                if (name === 'react') {
                    return '18.2.0';
                }
                if (name === 'typescript') {
                    return '5.4.5';
                }
                if (name === '@frontify/app-bridge') {
                    return '3.0.0';
                }
                return undefined;
            });

            const result = await collectFiles(tempDir, 'dist');

            const pkgJsonBase64: string = result.source_files['/package.json'] ?? '';
            const decoded = JSON.parse(Buffer.from(pkgJsonBase64, 'base64').toString('utf8')) as {
                devDependencies: Record<string, string>;
                peerDependencies: Record<string, string>;
            };
            expect(decoded.devDependencies).toEqual({ typescript: '5.4.5' });
            expect(decoded.peerDependencies).toEqual({ '@frontify/app-bridge': '3.0.0' });
        });
    });

    describe('handleDeployError', () => {
        let exitSpy: MockInstance;
        let consoleErrorSpy: MockInstance;

        beforeEach(() => {
            exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);
            consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        });

        afterEach(() => {
            exitSpy.mockRestore();
            consoleErrorSpy.mockRestore();
        });

        test('should log string errors and exit', () => {
            handleDeployError('something went wrong');

            expect(console.error).toHaveBeenCalledWith(expect.stringContaining('something went wrong'));
            expect(exitSpy).toHaveBeenCalledWith(-1);
        });

        test('should log Error instances using their message and exit', () => {
            handleDeployError(new Error('test error message'));

            expect(console.error).toHaveBeenCalledWith(expect.stringContaining('test error message'));
            expect(exitSpy).toHaveBeenCalledWith(-1);
        });

        test('should log unknown errors and exit', () => {
            handleDeployError(42);

            expect(console.error).toHaveBeenCalledWith(expect.stringContaining('unknown error'));
            expect(exitSpy).toHaveBeenCalledWith(-1);
        });

        test('should log null errors as unknown and exit', () => {
            handleDeployError(null);

            expect(console.error).toHaveBeenCalledWith(expect.stringContaining('unknown error'));
            expect(exitSpy).toHaveBeenCalledWith(-1);
        });
    });
});
