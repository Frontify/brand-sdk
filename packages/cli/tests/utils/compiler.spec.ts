/* (c) Copyright Frontify Ltd., all rights reserved. */

import { createHash } from 'node:crypto';

import { beforeEach, describe, expect, test, vi } from 'vitest';

import { compileBlock, compilePlatformApp, compileTheme } from '../../src/utils/compiler';

const rootPath = `${__dirname}/../files/compile-test-files`;
const outputFile = `${__dirname}/../files/compile-test-files/dist/index.js`;
const pathToIndex = 'index.tsx';

declare global {
    interface Window {
        index: { block: unknown; settings: unknown };
    }
}

vi.mock('crypto', () => ({
    createHash: vi.fn(() => ({
        update: vi.fn(() => ({
            digest: vi.fn(() => 'mocked hash'),
        })),
    })),
}));

describe('Compiler utils', () => {
    beforeEach(() => {
        global.window = {};
    });

    describe('compile Block', () => {
        test('should provide a valid build with block, settings and appBridge version', async () => {
            await compileBlock({ projectPath: rootPath, entryFile: pathToIndex, outputName: 'index' });
            await import(outputFile);

            expect(global.window).toHaveProperty('index');
            expect(global.window?.index.block).toBe('this is a block');
            expect(global.window?.index.settings).toMatchObject({ some: 'settings' });
            expect(global.window?.index.dependencies['@frontify/app-bridge']).toBe('^3.0.0-beta.99');
        });
    });

    describe('compile Theme', () => {
        test('should provide a valid build with theme', async () => {
            const result = await compileTheme({ projectPath: rootPath, entryFile: pathToIndex, outputName: 'index' });

            expect(result[0].output[0].exports).toStrictEqual(['default']);
            expect(result[0].output[0].fileName).toBe('index.js');
        });
    });

    describe('compile PlatformApp', () => {
        beforeEach(() => {
            global.window = {};
        });
        const testHash = 'mocked hash';

        test('should provide a valid build with a index.html', async () => {
            const outputNameTest = 'index';

            const result = (await compilePlatformApp({
                projectPath: rootPath,
                entryFile: pathToIndex,
                outputName: outputNameTest,
            })) as unknown as { app: { output: { fileName: string }[] }; settings: { output: { fileName: string }[] } };

            expect(createHash).toHaveBeenCalledWith('sha256');
            expect(result.app.output[0].fileName).toBe(`${outputNameTest}.${testHash}.js`);
            expect(result.app.output[1].fileName).toBe(`${outputNameTest}.${testHash}.css`);
            expect(result.app.output[2].fileName).toBe(`${outputNameTest}.${testHash}.html`);
            expect(result.settings[0].output[0].fileName).toBe('settings.js');
        });
    });
});
