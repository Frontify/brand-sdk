/* (c) Copyright Frontify Ltd., all rights reserved. */

import mockFs from 'mock-fs';
import { afterEach, describe, expect, it } from 'vitest';

import { getAppBridgeThemeVersion } from '../../src/utils/appBridgeThemeVersion';

const rootPath = 'frontify-cli';

describe('appBridgeThemeVersion utils', () => {
    afterEach(() => {
        mockFs.restore();
    });

    it('should return the 3 as version from package.json', () => {
        mockFs({
            'frontify-cli': {
                'package.json': '{"dependencies": {"@frontify/app-bridge-theme": "3"}}',
            },
        });

        expect(getAppBridgeThemeVersion(rootPath)).toEqual('3');
    });

    it('should return the 3.0.0-beta.99 as version from package.json', () => {
        mockFs({
            'frontify-cli': {
                'package.json': '{"dependencies": {"@frontify/app-bridge-theme": "3.0.0-beta.99"}}',
            },
        });

        expect(getAppBridgeThemeVersion(rootPath)).toEqual('3.0.0-beta.99');
    });

    it('should return the ^3.0.0 as version from package.json', () => {
        mockFs({
            'frontify-cli': {
                'package.json': '{"dependencies": {"@frontify/app-bridge-theme": "^3.0.0"}}',
            },
        });

        expect(getAppBridgeThemeVersion(rootPath)).toEqual('^3.0.0');
    });
});
