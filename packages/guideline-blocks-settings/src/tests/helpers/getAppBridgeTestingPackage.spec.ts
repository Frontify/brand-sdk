/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, it } from 'vitest';

import { getAppBridgeTestingPackage } from './getAppBridgeTestingPackage';

describe('getAppBridgeTestingPackage', () => {
    it('returns correctly the package', async () => {
        const appBridgeTestingPackage = await getAppBridgeTestingPackage();

        expect(Object.keys(appBridgeTestingPackage).length).toBeGreaterThanOrEqual(10);
        expect(appBridgeTestingPackage.getAppBridgeBlockStub).toBeDefined();
    });
});
