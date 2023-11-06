/* (c) Copyright Frontify Ltd., all rights reserved. */

import mockFs from 'mock-fs';
import { afterEach, describe, expect, it } from 'vitest';
import { getAppBridgeVersion } from '../../src/utils/appBridgeVersion.js';

const rootPath = 'frontify-cli';

describe('AppBridgeVersion utils', async () => {
    afterEach(() => {
        mockFs.restore();
    });

    it('should return the 3 as version from package.json', () => {
        mockFs({
            'frontify-cli': {
                'package.json': '{"dependencies": {"@frontify/app-bridge": "3"}',
            },
        });

        expect(getAppBridgeVersion(rootPath)).toEqual('3');
    });

    it('should return the 3.0.0-beta.99 as version from package.json', () => {
        mockFs({
            'frontify-cli': {
                'package.json': JSON.parse('{"dependencies": {"@frontify/app-bridge": "3.0.0-beta.99"}'),
            },
        });

        expect(getAppBridgeVersion(rootPath)).toEqual('3.0.0-beta.99');
    });

    it('should return the ^3.0.0 as version from package.json', () => {
        mockFs({
            'frontify-cli': {
                'package.json': JSON.parse('{"dependencies": {"@frontify/app-bridge": "^3.0.0"}'),
            },
        });

        expect(getAppBridgeVersion(rootPath)).toEqual('^3.0.0');
    });
});
