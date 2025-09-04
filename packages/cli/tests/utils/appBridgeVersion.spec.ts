/* (c) Copyright Frontify Ltd., all rights reserved. */

import { readFileSync } from 'node:fs';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { getAppBridgeVersion } from '../../src/utils/appBridgeVersion';

const rootPath = 'frontify-cli';

vi.mock('node:fs', () => {
    return {
        readFileSync: vi.fn(),
        writeFileSync: vi.fn(),
    };
});

describe('AppBridgeVersion utils', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should return the 3 as version from package.json', () => {
        vi.mocked(readFileSync).mockReturnValueOnce('{"dependencies": {"@frontify/app-bridge": "3"}}');
        expect(getAppBridgeVersion(rootPath)).toEqual('3');
    });

    it('should return the 3.0.0-beta.99 as version from package.json', () => {
        vi.mocked(readFileSync).mockReturnValueOnce('{"dependencies": {"@frontify/app-bridge": "3.0.0-beta.99"}}');
        expect(getAppBridgeVersion(rootPath)).toEqual('3.0.0-beta.99');
    });

    it('should return the ^3.0.0 as version from package.json', () => {
        vi.mocked(readFileSync).mockReturnValueOnce('{"dependencies": {"@frontify/app-bridge": "^3.0.0"}}');
        expect(getAppBridgeVersion(rootPath)).toEqual('^3.0.0');
    });
});
