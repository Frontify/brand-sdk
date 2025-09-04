/* (c) Copyright Frontify Ltd., all rights reserved. */

import { readFileSync, writeFileSync } from 'node:fs';

import { beforeEach, afterEach, describe, expect, test, vi } from 'vitest';

import { reactiveJson } from '../../src/utils/reactiveJson';

const testString = '{ "some": "body" }';
const testObject = JSON.parse(testString);

const expectedString = '{\n\t"some": "one",\n\t"told": "me"\n}';
const expectedObject = JSON.parse(expectedString);

const fileTestPath = './frontify-cli/someObject.json';

interface JsonFile {
    some: string;
    told: string;
}

vi.mock('node:fs', () => {
    return {
        readFileSync: vi.fn(),
        writeFileSync: vi.fn(),
    };
});

describe('Reactive JSON utils', () => {
    beforeEach(() => {
        vi.mocked(readFileSync).mockReset();
        vi.mocked(writeFileSync).mockReset();
        vi.mocked(readFileSync).mockReturnValue(testString);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('reactiveJson', () => {
        test('should read json and make it as an object', () => {
            const reactiveObject = reactiveJson(fileTestPath);
            expect(reactiveObject).toEqual(testObject);
        });

        test('should read json and write changes to the file', () => {
            const reactiveObject = reactiveJson<JsonFile>(fileTestPath);
            reactiveObject.some = 'one';
            reactiveObject.told = 'me';
            expect(reactiveObject).toEqual(expectedObject);

            expect(writeFileSync).toHaveBeenCalledWith(fileTestPath, expectedString);
        });
    });
});
