/* (c) Copyright Frontify Ltd., all rights reserved. */

import { beforeEach, describe, expect, test, vi } from 'vitest';

import { compileBlock, compilePlatformApp, compileTheme, getReactVersion, getAppBridgeVersion } from '../../src/utils';

const rootPath = `${__dirname}/../files/compile-test-files`;
const outputFile = `${__dirname}/../files/compile-test-files/dist/index.js`;
const pathToIndex = 'index.tsx';

vi.mock(import('../../src/utils/appBridgeVersion'));
vi.mock(import('../../src/utils/reactVersion'));
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
        test('should provide a valid build with dependencies versions', async () => {
            vi.mocked(getAppBridgeVersion).mockReturnValue('^3.12.0');
            vi.mocked(getReactVersion).mockReturnValue('^18.3.1');

            await compileBlock({ projectPath: rootPath, entryFile: pathToIndex, outputName: 'index' });
            await import(outputFile);

            expect(global.window).toHaveProperty('index');
            expect(global.window?.index.dependencies['@frontify/app-bridge']).toBe('^3.12.0');
            expect(global.window?.index.dependencies.react).toBe('^18.3.1');
        });
    });

    describe('compile Theme', () => {
        const rootPath = `${__dirname}/../files/compile-theme-files`;
        const outputFile = `${__dirname}/../files/compile-theme-files/dist/index.js`;

        test('should provide a valid build with theme', async () => {
            await compileTheme({ projectPath: rootPath, entryFile: pathToIndex, outputName: 'index' });

            await import(outputFile);

            expect(global.window).toHaveProperty('index');
            expect(global.window?.index.block).toBe('this is a theme');
            expect(global.window?.index.settings).toMatchObject({ some: 'theme-settings' });
            expect(global.window?.index.dependencies['@frontify/app-bridge-theme']).toBe('^2.0.0-beta.69');
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

            expect(result.app.output[0].fileName).toBe('assets/index-DjzrFwQ_.js');
            expect(result.app.output[1].fileName).toBe('assets/index-B-tCd20v.css');
            expect(result.app.output[2].fileName).toBe('index.html');
            expect(result.settings[0].output[0].fileName).toBe('settings.js');
        });
    });
});
