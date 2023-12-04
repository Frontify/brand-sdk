/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { Asset } from '../../types';

export type GetAssetBulkDownloadTokenPayload = {
    blockAssets?: Record<string, Asset[]>;
};

export type GetAssetBulkDownloadTokenResponse = {
    assetBulkDownloadToken: string;
};

export const withGetAssetBulkDownloadTokenPayload = (
    blockAssets?: GetAssetBulkDownloadTokenPayload['blockAssets'],
): {
    name: 'getAssetBulkDownloadToken';
    payload: GetAssetBulkDownloadTokenPayload;
} => ({
    name: 'getAssetBulkDownloadToken',
    payload: blockAssets ? { blockAssets } : {},
});
