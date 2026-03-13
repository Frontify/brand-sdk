/* (c) Copyright Frontify Ltd., all rights reserved. */

import { readFileSync } from 'node:fs';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { getReactVersion } from '../../src/utils/reactVersion';

const rootPath = 'frontify-cli';

vi.mock('node:fs', () => {
    return {
        readFileSync: vi.fn(),
        writeFileSync: vi.fn(),
    };
});

describe('ReactVersion utils', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should return the 18 as version from package.json', () => {
        vi.mocked(readFileSync).mockReturnValueOnce('{"dependencies": {"react": "18"}}');
        expect(getReactVersion(rootPath)).toEqual('18');
    });
});
