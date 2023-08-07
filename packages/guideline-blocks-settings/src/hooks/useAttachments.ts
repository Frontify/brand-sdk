/* (c) Copyright Frontify Ltd., all rights reserved. */

import { AppBridgeBlock, Asset, useBlockAssets } from '@frontify/app-bridge';

export const useAttachments = (appBridge: AppBridgeBlock, assetId: string) => {
    const { blockAssets, updateAssetIdsFromKey } = useBlockAssets(appBridge);
    const attachments = blockAssets?.[assetId] || [];

    const onAddAttachments = async (newAssets: Asset[]) => {
        const newAssetIds = attachments.map((attachment) => attachment.id);
        for (const asset of newAssets) {
            newAssetIds.push(asset.id);
        }
        await updateAssetIdsFromKey(assetId, newAssetIds);
    };

    const onAttachmentDelete = async (assetToDelete: Asset) => {
        const newAssetIds = attachments
            .filter((attachment) => attachment.id !== assetToDelete.id)
            .map((attachment) => attachment.id);

        await updateAssetIdsFromKey(assetId, newAssetIds);
    };

    const onAttachmentReplace = async (attachmentToReplace: Asset, newAsset: Asset) => {
        const newAssetIds = attachments.map((attachment) =>
            attachment.id === attachmentToReplace.id ? newAsset.id : attachment.id,
        );

        await updateAssetIdsFromKey(assetId, newAssetIds);
    };

    const onAttachmentsSorted = async (assets: Asset[]) => {
        const newAssetIds = assets.map((asset) => asset.id);

        await updateAssetIdsFromKey(assetId, newAssetIds);
    };

    return {
        onAddAttachments,
        onAttachmentDelete,
        onAttachmentReplace,
        onAttachmentsSorted,
        attachments,
    };
};
