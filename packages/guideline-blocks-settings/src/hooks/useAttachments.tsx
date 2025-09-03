/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type AppBridgeBlock, type Asset, useBlockAssets } from '@frontify/app-bridge';
import { type ReactNode, createContext, useContext } from 'react';

import { type BlockProps } from '../index';

export const useAttachmentOperations = (attachmentKey: string, blockAssetBundle: ReturnType<typeof useBlockAssets>) => {
    const { blockAssets, addAssetIdsToKey, deleteAssetIdsFromKey, updateAssetIdsFromKey } = blockAssetBundle;
    const attachments = blockAssets?.[attachmentKey] || [];

    const onAttachmentsAdd = async (newAssets: Asset[]) => {
        await addAssetIdsToKey(
            attachmentKey,
            newAssets.map((asset) => asset.id),
        );
    };

    const onAttachmentDelete = async (assetToDelete: Asset) => {
        await deleteAssetIdsFromKey(attachmentKey, [assetToDelete.id]);
    };

    const onAttachmentReplace = async (attachmentToReplace: Asset, newAsset: Asset) => {
        const newAssetIds = attachments.map((attachment) =>
            attachment.id === attachmentToReplace.id ? newAsset.id : attachment.id,
        );

        await updateAssetIdsFromKey(attachmentKey, newAssetIds);
    };

    const onAttachmentsSorted = async (assets: Asset[]) => {
        const newAssetIds = assets.map((asset) => asset.id);

        await updateAssetIdsFromKey(attachmentKey, newAssetIds);
    };

    return {
        onAttachmentsAdd,
        onAttachmentDelete,
        onAttachmentReplace,
        onAttachmentsSorted,
        attachments,
    };
};

export const useAttachments = (appBridge: AppBridgeBlock, attachmentKey: string) => {
    const { onAttachmentsAdd, onAttachmentDelete, onAttachmentReplace, onAttachmentsSorted, attachments } =
        useAttachmentOperations(attachmentKey, useBlockAssets(appBridge));

    return {
        onAttachmentsAdd,
        onAttachmentDelete,
        onAttachmentReplace,
        onAttachmentsSorted,
        attachments,
        appBridge,
    };
};

const AttachmentsContext = createContext<ReturnType<typeof useAttachments> | null>(null);
AttachmentsContext.displayName = 'AttachmentsContext';

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

export const AttachmentOperationsProvider = ({
    blockAssetBundle,
    appBridge,
    children,
    assetId,
}: {
    blockAssetBundle: ReturnType<typeof useBlockAssets>;
    children: ReactNode;
    assetId: string;
    appBridge: AppBridgeBlock;
}) => {
    const attachmentContext = useAttachmentOperations(assetId, blockAssetBundle);

    return (
        <AttachmentsContext.Provider value={{ ...attachmentContext, appBridge }}>
            {children}
        </AttachmentsContext.Provider>
    );
};

export const useAttachmentsContext = () => {
    const context = useContext(AttachmentsContext);

    if (!context) {
        throw new Error(
            "No AttachmentsContext Provided. Component must be wrapped in an 'AttachmentsProvider' or the 'withAttachmentsProvider' HOC",
        );
    }

    return context;
};

/**
 * Block-level HOC for cases when there is only one attachment asset field related to the block.
 * Recommended for most cases.
 * If finer control is required over attachments, use {@link AttachmentsProvider} component.
 */
export const withAttachmentsProvider = <T extends BlockProps>(Component: (props: T) => ReactNode, assetId: string) => {
    const wrappedComponent = (props: T) => (
        <AttachmentsProvider appBridge={props.appBridge} assetId={assetId}>
            <Component {...props} />
        </AttachmentsProvider>
    );

    wrappedComponent.displayName = 'withAttachmentsProvider';

    return wrappedComponent;
};
