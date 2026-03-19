/* (c) Copyright Frontify Ltd., all rights reserved. */

import { beforeEach, describe, expect, test, vi } from 'vitest';

import {
    compileBlock,
    compilePlatformApp,
    compileTheme,
    getReactVersion,
    getAppBridgeVersion,
    getAppBridgeThemeVersion,
} from '../../src/utils';

const rootPath = `${__dirname}/../files/compile-test-files`;
const outputFile = `${__dirname}/../files/compile-test-files/dist/index.js`;
const pathToIndex = 'index.tsx';

vi.mock(import('../../src/utils/getPackageVersion'));
declare global {
    interface Window {
        index: {
            block?: unknown;
            settings?: unknown;
            dependencies: Record<string, string>;
        };
    }
}

describe('Compiler utils', () => {
    beforeEach(() => {
        global.window = {};
    });

    describe('compile Block', () => {
        test('should provide a valid build', async () => {
            await compileBlock({ projectPath: rootPath, entryFile: pathToIndex, outputName: 'index' });
            const module = await import(`${outputFile}?t=${Date.now()}`);

            expect(module.default.block).toBe('this is a block');
            expect(module.default.settings).toMatchObject({ some: 'settings' });
        });
    });

    describe('compile Theme', () => {
        const rootPath = `${__dirname}/../files/compile-theme-files`;
        const outputFile = `${__dirname}/../files/compile-theme-files/dist/index.js`;

        test('should provide a valid build with theme', async () => {
            await compileTheme({ projectPath: rootPath, entryFile: pathToIndex, outputName: 'index' });

            const module = await import(`${outputFile}?t=${Date.now()}`);

            expect(module.default.block).toBe('this is a theme');
            expect(module.default.settings).toMatchObject({ some: 'theme-settings' });
        });
    });

    describe('compile PlatformApp', () => {
        beforeEach(() => {
            global.window = {};
        });

        test('should provide a valid build with a index.html', async () => {
            const outputNameTest = 'index';

            const result = (await compilePlatformApp({
                projectPath: rootPath,
                entryFile: pathToIndex,
                outputName: outputNameTest,
            })) as unknown as { app: { output: { fileName: string }[] }; settings: { output: { fileName: string }[] } };

            expect(
                result.app.output.find((o) => o.fileName.endsWith('.js') && o.fileName.startsWith('assets/index-')),
            ).toBeDefined();
            expect(
                result.app.output.find((o) => o.fileName.endsWith('.css') && o.fileName.startsWith('assets/index-')),
            ).toBeDefined();
            expect(result.app.output.find((o) => o.fileName === 'index.html')).toBeDefined();
            expect(result.settings[0].output[0].fileName).toBe('settings.js');
        });
    });
});
