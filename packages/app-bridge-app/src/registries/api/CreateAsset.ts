/* (c) Copyright Frontify Ltd., all rights reserved. */

export type CreateAssetPayload = {
    data: File | Blob | string;
    filename: string;
    parentId?: string;
    description?: string;
    externalId?: string;
    tags?: { value: string }[];
};

export type CreateAssetResponse = {
    assetId: string;
};

export const createAsset = (payload: CreateAssetPayload): { name: 'createAsset'; payload: CreateAssetPayload } => ({
    name: 'createAsset',
    payload,
});
