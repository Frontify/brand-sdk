/* (c) Copyright Frontify Ltd., all rights reserved. */

import { afterEach, describe, expect, test, vi } from 'vitest';

import { AssetApiDummy, AssetDummy, HttpUtilResponseDummy } from '../tests';
import { HttpClient } from '../utilities/httpClient';

import { createAssetByFileId, mapAssetApiToAsset } from './AssetRepository';

const ASSET_ID = 222;
const FILE_ID = 'x1x1x1x1x1x1';
const PROJECT_ID = 1;
const SET_ID = 1;

describe('AssetRepositoryTest', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    test('createAssetByFileId with success', async () => {
        const assetApiDummy = AssetApiDummy.with(ASSET_ID);

        const mockHttpClientPost = vi.fn().mockReturnValue(HttpUtilResponseDummy.successWith(assetApiDummy));

        HttpClient.post = mockHttpClientPost;

        const result = createAssetByFileId(FILE_ID, PROJECT_ID, SET_ID);

        expect(mockHttpClientPost).toHaveBeenCalledTimes(1);
        await expect(result).resolves.toEqual({ ...assetApiDummy, ...mapAssetApiToAsset(assetApiDummy) });
    });

    test('should map create asset from api to frontify correctly', () => {
        expect(mapAssetApiToAsset(AssetApiDummy.with(ASSET_ID))).toEqual(AssetDummy.with(ASSET_ID));
    });
});
