/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, it } from 'vitest';
import { getAppBridgeVersion, getMajorVersion } from '../../src/utils/appBridgeVersion.js';

const rootPath = `${__dirname}/../files/compile-test-files`;

describe('AppBridgeVersion utils', async () => {
    it.each([
        ['', 0],
        ['hello world', 0],
        ['3.0.0-beta.99', 3],
        ['>1.2.3-alpha.1', 1],
        ['^2.3.4', 2],
        ['~3.4.5', 3],
    ])('should return the correct major version', (version, expected) => {
        expect(getMajorVersion(version)).toEqual(expected);
    });

    it('should return the correct major version from package.json', () => {
        expect(getAppBridgeVersion(rootPath)).toEqual(3);
    });
});
