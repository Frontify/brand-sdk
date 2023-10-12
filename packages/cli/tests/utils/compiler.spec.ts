/* (c) Copyright Frontify Ltd., all rights reserved. */

import { beforeEach, describe, expect, test, vi } from 'vitest';
import { compileBlock, compilePlatformApp } from '../../src/utils/compiler.js';
import { createHash } from 'crypto';

const rootPath = `${__dirname}/../files/compile-test-files`;
const outputFile = `${__dirname}/../files/compile-test-files/dist/index.js`;
const pathToIndex = 'index.tsx';

declare global {
    interface Window {
        index: { block: unknown; settings: unknown };
    }
}

describe('Compiler utils', async () => {
    beforeEach(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        global.window = {};
    });

    describe('compile Block', () => {
        test('should provide a valid build with block and settings', async () => {
            await compileBlock({ projectPath: rootPath, entryFile: pathToIndex, outputName: 'index' });
            await import(outputFile);
            expect(global.window).toHaveProperty('index');
            expect(global.window?.index.block).toBe('this is a block');
            expect(global.window?.index.settings).toMatchObject({ some: 'settings' });
        });
    });

    describe('compile PlatformApp', () => {
        const testHash = 'mocked hash';
        vi.mock('crypto', () => ({
            createHash: vi.fn(() => ({
                update: vi.fn(() => ({
                    digest: vi.fn(() => 'mocked hash'),
                })),
            })),
        }));

        test('should provide a valid build with a index.html', async () => {
            const outputNameTest = 'test-output';
            const result = (await compilePlatformApp({
                projectPath: rootPath,
                entryFile: '',
                outputName: outputNameTest,
            })) as unknown as { output: { fileName: string }[] };
            console.log(result.output[1].fileName);
            expect(createHash).toHaveBeenCalledWith('sha256');
            expect(result.output[0].fileName).toBe(`${outputNameTest}.${testHash}.js`);
            expect(result.output[1].fileName).toBe(`${outputNameTest}.${testHash}.css`);
            expect(result.output[2].fileName).toBe(`${outputNameTest}.${testHash}.html`);
        });
    });
});
