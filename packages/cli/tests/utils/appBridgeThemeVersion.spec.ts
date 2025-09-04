/* (c) Copyright Frontify Ltd., all rights reserved. */

import { readFileSync } from 'node:fs';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { getAppBridgeThemeVersion } from '../../src/utils/appBridgeThemeVersion';

const rootPath = 'frontify-cli';

vi.mock('node:fs', () => {
    return {
        readFileSync: vi.fn(),
        writeFileSync: vi.fn(),
    };
});

describe('appBridgeThemeVersion utils', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should return the 3 as version from package.json', () => {
        vi.mocked(readFileSync).mockReturnValueOnce('{"dependencies": {"@frontify/app-bridge-theme": "3"}}');
        expect(getAppBridgeThemeVersion(rootPath)).toEqual('3');
    });

    it('should return the 3.0.0-beta.99 as version from package.json', () => {
        vi.mocked(readFileSync).mockReturnValueOnce(
            '{"dependencies": {"@frontify/app-bridge-theme": "3.0.0-beta.99"}}',
        );
        expect(getAppBridgeThemeVersion(rootPath)).toEqual('3.0.0-beta.99');
    });

    it('should return the ^3.0.0 as version from package.json', () => {
        vi.mocked(readFileSync).mockReturnValueOnce('{"dependencies": {"@frontify/app-bridge-theme": "^3.0.0"}}');
        expect(getAppBridgeThemeVersion(rootPath)).toEqual('^3.0.0');
    });
});
