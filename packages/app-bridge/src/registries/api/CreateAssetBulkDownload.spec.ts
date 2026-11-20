/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, it } from 'vitest';

import { AssetDummy } from '../../tests/AssetDummy';

import { createAssetBulkDownload } from './CreateAssetBulkDownload';

describe('CreateAssetBulkDownload', () => {
    it('should return correct method name and an empty payload by default', () => {
        const assetBulkDownload = createAssetBulkDownload();
        expect(assetBulkDownload.name).toBe('createAssetBulkDownload');
        expect(assetBulkDownload.payload).toStrictEqual({});
    });

    it('should pass the block assets and signal in the payload', () => {
        const blockAssets = { images: [AssetDummy.with(1)] };
        const { signal } = new AbortController();
        const assetBulkDownload = createAssetBulkDownload({ blockAssets, signal });
        expect(assetBulkDownload.payload).toStrictEqual({ blockAssets, signal });
    });
});
