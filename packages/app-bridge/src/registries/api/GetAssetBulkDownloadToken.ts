/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type Asset } from '../../types';

export type GetAssetBulkDownloadTokenPayload = {
    blockAssets?: Record<string, Asset[]>;
};

export type GetAssetBulkDownloadTokenResponse = {
    assetBulkDownloadToken: string;
};

/**
 * @deprecated This will be removed in version 5.0.0 of `@frontify/app-bridge`.
 * Use the `createAssetBulkDownload` API method instead, or the `useAssetBulkDownload` hook. They wait until the download is ready.
 */
export const getAssetBulkDownloadToken = (
    blockAssets?: GetAssetBulkDownloadTokenPayload['blockAssets'],
): {
    name: 'getAssetBulkDownloadToken';
    payload: GetAssetBulkDownloadTokenPayload;
} => ({
    name: 'getAssetBulkDownloadToken',
    payload: blockAssets ? { blockAssets } : {},
});
