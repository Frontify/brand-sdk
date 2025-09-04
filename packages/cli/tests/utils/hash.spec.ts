/* (c) Copyright Frontify Ltd., all rights reserved. */

import { createReadStream, type ReadStream } from 'node:fs';
import { Readable } from 'node:stream';

import { afterEach, describe, expect, test, vi } from 'vitest';

import { getFileHash } from '../../src/utils/hash';

const fileTestPath = './frontify-cli/file.zip';
const fileHash = '985d04be3bf158cad5cf964625c9db7b464fa28525bff0c007d56b57a6e66668';

vi.mock('node:fs', () => {
    return {
        createReadStream: vi.fn(),
    };
});

describe('Hash utils', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('getFileHash', () => {
        test('should generate a hash for a file', async () => {
            const mockStream = new Readable();
            mockStream.push('some random bytes');
            mockStream.push(null);
            vi.mocked(createReadStream).mockReturnValue(mockStream as unknown as ReadStream);

            expect(await getFileHash(fileTestPath)).toEqual(fileHash);
        });
    });
});
