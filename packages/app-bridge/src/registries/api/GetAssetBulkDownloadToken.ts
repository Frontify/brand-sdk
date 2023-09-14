/* (c) Copyright Frontify Ltd., all rights reserved. */

export type GetAssetBulkDownloadTokenPayload = {
    documentBlockId: number;
    settingIds?: string[];
};

export type GetAssetBulkDownloadTokenResponse = {
    assetBulkDownloadToken: string;
};
