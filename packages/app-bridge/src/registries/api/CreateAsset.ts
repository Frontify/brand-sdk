/* (c) Copyright Frontify Ltd., all rights reserved. */

export type GetCreateAssetPayload = {
    file: File | Blob;
    projectId: string;
    title: string;
    description: string;
    externalId: string;
    tags: { value: string }[];
    directory: string[];
};

export type GetCreateAssetResponse = {
    assetId: string;
};
