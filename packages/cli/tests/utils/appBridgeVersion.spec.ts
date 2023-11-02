/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, it } from 'vitest';
import { getAppBridgeVersion } from '../../src/utils/appBridgeVersion.js';

const rootPath = `${__dirname}/../files/compile-test-files`;

describe('AppBridgeVersion utils', async () => {
    it('should return the correct major version from package.json', () => {
        expect(getAppBridgeVersion(rootPath)).toEqual('^3.0.0-beta.99');
    });
});
