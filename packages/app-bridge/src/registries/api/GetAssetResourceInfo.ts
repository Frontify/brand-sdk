/* (c) Copyright Frontify Ltd., all rights reserved. */

export type GetAssetResourceInfoPayload = {
    assetId: string;
};

export type GetAssetResourceInfoResponse = {
    type: string;
    id: string;
    title?: string;
    previewUrl?: string;
    downloadUrl?: string;
    filename?: string;
    sourceUrl?: string;
    html?: string;
};
