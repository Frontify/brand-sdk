/* (c) Copyright Frontify Ltd., all rights reserved. */

import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { Configuration } from '../../src/utils/configuration';

import type * as UtilsModule from '../../src/utils/index';

const promiseExecMock = vi.fn().mockResolvedValue('');

vi.mock('../../src/utils/index', async (importOriginal) => {
    const original = await importOriginal<typeof UtilsModule>();
    return { ...original, promiseExec: promiseExecMock };
});

const { collectFiles, handleDeployError, resolveCredentials, verifyCode } = await import('../../src/commands/deploy');

describe('Deploy command helpers', () => {
    describe('resolveCredentials', () => {
        let oldTokens: unknown;
        let oldInstanceUrl: unknown;

        beforeEach(() => {
            oldTokens = Configuration.get('tokens') || {};
            oldInstanceUrl = Configuration.get('instanceUrl') || '';
        });

        afterEach(() => {
            Configuration.set('tokens', oldTokens);
            Configuration.set('instanceUrl', oldInstanceUrl);
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

            const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);
            console.error = vi.fn();

            resolveCredentials();
            expect(exitSpy).toHaveBeenCalledWith(-1);

            exitSpy.mockRestore();
        });

        test('should exit when no instance URL is available', () => {
            Configuration.set('tokens', { access_token: 'some-token' });
            Configuration.delete('instanceUrl');

            const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);
            console.error = vi.fn();

            resolveCredentials();
            expect(exitSpy).toHaveBeenCalledWith(-1);

            exitSpy.mockRestore();
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
        });

        afterEach(() => {
            rmSync(tempDir, { recursive: true, force: true });
        });

        test('should collect build files excluding source maps', async () => {
            const result = await collectFiles(tempDir, 'dist');

            expect(result.build_files).toHaveProperty('/index.js');
            expect(result.build_files).not.toHaveProperty('/index.js.map');
        });

        test('should collect dependencies from package.json', async () => {
            const result = await collectFiles(tempDir, 'dist');

            expect(result.dependencies).toEqual({ react: '18.0.0' });
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
    });

    describe('handleDeployError', () => {
        let exitSpy: ReturnType<typeof vi.spyOn>;

        beforeEach(() => {
            exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);
            console.error = vi.fn();
        });

        afterEach(() => {
            exitSpy.mockRestore();
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
