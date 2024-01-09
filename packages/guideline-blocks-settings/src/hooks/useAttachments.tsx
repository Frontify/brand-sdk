/* (c) Copyright Frontify Ltd., all rights reserved. */

import { AppBridgeBlock, Asset, useBlockAssets } from '@frontify/app-bridge';
import { FC, ReactNode, createContext, useContext } from 'react';
import { BlockProps } from 'src';

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
        appBridge,
    };
};

const AttachmentsContext = createContext<ReturnType<typeof useAttachments> | null>(null);

export const AttachmentsProvider = ({
    appBridge,
    children,
    assetId,
}: {
    appBridge: AppBridgeBlock;
    children: ReactNode;
    assetId: string;
}) => {
    const attachmentContext = useAttachments(appBridge, assetId);

    return <AttachmentsContext.Provider value={attachmentContext}>{children}</AttachmentsContext.Provider>;
};

export const useAttachmentsContext = () => {
    const context = useContext(AttachmentsContext);

    if (!context) {
        throw new Error(
            "No AttachmentsContext Provided. Component must be wrapped in an 'AttachmentsProvider' or the 'withAttachments' HOC",
        );
    }

    return context;
};

export const withAttachments = <T extends BlockProps>(Component: FC<T>, assetId: string) => {
    const wrappedComponent = (props: T) => (
        <AttachmentsProvider appBridge={props.appBridge} assetId={assetId}>
            <Component {...props} />
        </AttachmentsProvider>
    );

    wrappedComponent.displayName = 'withAttachments';

    return wrappedComponent;
};
