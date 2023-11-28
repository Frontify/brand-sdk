/* (c) Copyright Frontify Ltd., all rights reserved. */

import { Asset } from '../../types';

export type GetAssetBulkDownloadTokenPayload = {
    documentBlockId: number;
    blockAssets?: Record<string, Asset[]>;
};

export type GetAssetBulkDownloadTokenResponse = {
    assetBulkDownloadToken: string;
};
