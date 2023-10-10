/* (c) Copyright Frontify Ltd., all rights reserved. */

import { beforeEach, describe, expect, test } from 'vitest';
import { compileBlock } from '../../src/utils/compiler.js';

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

    describe('compile', () => {
        test('should provide a valid build with block and settings', async () => {
            await compileBlock({ projectPath: rootPath, entryFile: pathToIndex, outputName: 'index' });
            await import(outputFile);
            expect(global.window).toHaveProperty('index');
            expect(global.window?.index.block).toBe('this is a block');
            expect(global.window?.index.settings).toMatchObject({ some: 'settings' });
        });
    });
});
