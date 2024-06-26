/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, it } from 'vitest';

import { getAssetResourceInformation } from './GetAssetResourceInformation';

describe('GetAssetResourceInformation', () => {
    it('should return correct method name', () => {
        const TEST_ID = 'test-123';
        const assetResourceInformation = getAssetResourceInformation({
            assetId: TEST_ID,
        });
        expect(assetResourceInformation.name).toBe('getAssetResourceInformation');
        expect(assetResourceInformation.payload).toStrictEqual({
            assetId: TEST_ID,
        });
    });
});
