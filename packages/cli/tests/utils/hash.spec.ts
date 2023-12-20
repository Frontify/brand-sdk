/* (c) Copyright Frontify Ltd., all rights reserved. */

import mockFs, { restore } from 'mock-fs';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';

import { getFileHash } from '../../src/utils/hash';

const fileTestPath = './frontify-cli/file.zip';
const fileHash = '985d04be3bf158cad5cf964625c9db7b464fa28525bff0c007d56b57a6e66668';

describe('Hash utils', () => {
    beforeEach(() => {
        mockFs({
            'frontify-cli': {
                'file.zip': 'some random bytes',
            },
        });
    });

    afterEach(() => {
        restore();
    });

    describe('getFileHash', () => {
        test('should generate a hash for a file', async () => {
            expect(await getFileHash(fileTestPath)).toEqual(fileHash);
        });
    });
});
