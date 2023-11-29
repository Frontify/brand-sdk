/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { AppBridgeBlock, Asset } from '../..';

export type GetAssetBulkDownloadTokenPayload = {
    appBridge: AppBridgeBlock;
    blockAssets?: Record<string, Asset[]>;
};

export type GetAssetBulkDownloadTokenResponse = {
    assetBulkDownloadToken: string;
};
