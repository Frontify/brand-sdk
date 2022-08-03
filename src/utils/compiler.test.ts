/* (c) Copyright Frontify Ltd., all rights reserved. */

import { beforeEach, describe, expect, test } from 'vitest';
import { compile } from './compiler';

const rootPath = `${__dirname}/../../`;
const outputFile = `${__dirname}/../../dist/index.js`;
const pathToIndex = '__mocks__/index.tsx';

declare global {
    interface Window {
        index: { block: unknown; settings: unknown };
    }
}

describe('Compiler utils', async () => {
    beforeEach(() => {
        global.window = {} as any;
    });

    describe('compile', () => {
        test('should provide a valid build with block and settings', async () => {
            await compile(rootPath, pathToIndex, 'index');
            await import(outputFile);
            expect(global.window).toHaveProperty('index');
            expect(global.window?.index.block).toBe('this is a block');
            expect(global.window?.index.settings).toMatchObject({ some: 'settings' });
        });
    });
});
