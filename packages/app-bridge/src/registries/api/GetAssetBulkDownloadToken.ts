/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { Asset } from '../../types';

export type GetAssetBulkDownloadTokenPayload = {
    blockAssets?: Record<string, Asset[]>;
};

export type GetAssetBulkDownloadTokenResponse = {
    assetBulkDownloadToken: string;
};
