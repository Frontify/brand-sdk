import mockFs from 'mock-fs';
import { readFileSync } from 'fs';
import { reactiveJson } from './reactiveJson';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';

const testString = '{ "some": "body" }';
const testObject = JSON.parse(testString);

const expectedString = '{\n\t"some": "one",\n\t"told": "me"\n}';
const expectedObject = JSON.parse(expectedString);

const fileTestPath = './frontify-cli/someObject.json';

interface JsonFile {
    some: string;
    told: string;
}

describe('Reactive JSON utils', () => {
    beforeEach(() => {
        mockFs({
            'frontify-cli': {
                'someObject.json': testString,
            },
        });
    });

    afterEach(() => {
        mockFs.restore();
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

            const jsonFileContent = readFileSync(fileTestPath, 'utf-8');
            expect(jsonFileContent).toEqual(expectedString);
        });
    });
});
