/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, it } from 'vitest';

import { setAssetIdsByBlockAssetKey } from './SetAssetIdsByBlockAssetKey';

describe('SetAssetIdsByBlockAssetKey', () => {
    it('should return correct method name', () => {
        const TEST_KEY = 'settingName';
        const TEST_ASSET_IDS = [51, 52];
        const assetIdsByBlockAssetKey = setAssetIdsByBlockAssetKey({
            key: TEST_KEY,
            assetIds: TEST_ASSET_IDS,
        });
        expect(assetIdsByBlockAssetKey.name).toBe('setAssetIdsByBlockAssetKey');
        expect(assetIdsByBlockAssetKey.payload).toStrictEqual({
            key: TEST_KEY,
            assetIds: TEST_ASSET_IDS,
        });
    });
});
