/* (c) Copyright Frontify Ltd., all rights reserved. */

export type GetCreateAssetPayload = {
    file: File | Blob;
    title: string;
    parentId?: string;
    description?: string;
    externalId?: string;
    tags?: { value: string }[];
};

export type GetCreateAssetResponse = {
    assetId: string;
};
