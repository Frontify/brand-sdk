/* (c) Copyright Frontify Ltd., all rights reserved. */

export type SetAssetIdsByBlockAssetKeyPayload = {
    key: string;
    assetIds: number[];
};

export type SetAssetIdsByBlockAssetKeyResponse = void;

export const setAssetIdsByBlockAssetKey = (
    payload: SetAssetIdsByBlockAssetKeyPayload,
): { name: 'setAssetIdsByBlockAssetKey'; payload: SetAssetIdsByBlockAssetKeyPayload } => ({
    name: 'setAssetIdsByBlockAssetKey',
    payload,
});
