/* (c) Copyright Frontify Ltd., all rights reserved. */

export type GetAssetResourceInformationPayload = {
    assetId: string;
};

export type GetAssetResourceInformationResponse = {
    type: string;
    id: string;
    title?: string;
    previewUrl?: string;
    downloadUrl?: string;
    filename?: string | null;
    sourceUrl?: string;
    html?: string;
};

export const getAssetResourceInformation = (
    payload: GetAssetResourceInformationPayload,
): { name: 'getAssetResourceInformation'; payload: GetAssetResourceInformationPayload } => ({
    name: 'getAssetResourceInformation',
    payload,
});
