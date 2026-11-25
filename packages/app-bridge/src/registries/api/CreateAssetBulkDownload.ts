/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type Asset } from '../../types';

export type CreateAssetBulkDownloadPayload = {
    /**
     * The assets to download, grouped by block asset key.
     * Downloads all the assets of the block when omitted.
     */
    blockAssets?: Record<string, Asset[]>;
    /**
     * Stops waiting for the download. The call then rejects.
     */
    signal?: AbortSignal;
};

export type CreateAssetBulkDownloadResponse = {
    /**
     * The URL of the archive with the requested assets.
     */
    downloadUrl: string;
};

/**
 * Prepares an archive with the given assets and waits until it is ready.
 *
 * Resolves with the download URL once the archive is ready.
 * Rejects when preparing the archive fails or when `signal` is aborted.
 */
export const createAssetBulkDownload = (
    payload: CreateAssetBulkDownloadPayload = {},
): { name: 'createAssetBulkDownload'; payload: CreateAssetBulkDownloadPayload } => ({
    name: 'createAssetBulkDownload',
    payload,
});
