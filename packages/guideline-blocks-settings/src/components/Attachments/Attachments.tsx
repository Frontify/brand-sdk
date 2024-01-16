/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useEffect, useState } from 'react';
import { Asset, useAssetUpload, useEditorState } from '@frontify/app-bridge';
import {
    AssetInput,
    AssetInputSize,
    Flyout,
    FlyoutPlacement,
    LegacyTooltip as Tooltip,
    TooltipPosition,
} from '@frontify/fondue';

import { AttachmentItem } from './AttachmentItem';
import { type AttachmentsProps } from './types';
import { AttachmentsButtonTrigger } from './AttachmentsButtonTrigger';

export const Attachments = ({
    items = [],
    onDelete,
    onReplaceWithBrowse,
    onReplaceWithUpload,
    onBrowse,
    onUpload,
    appBridge,
    triggerComponent: TriggerComponent = AttachmentsButtonTrigger,
    isOpen,
    onOpenChange,
}: AttachmentsProps) => {
    const [internalItems, setInternalItems] = useState<Asset[]>(items);
    const [isFlyoutOpenInternal, setIsFlyoutOpenInternal] = useState(false);
    const [isUploadLoading, setIsUploadLoading] = useState(false);
    const [assetIdsLoading, setAssetIdsLoading] = useState<number[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
    const isEditing = useEditorState(appBridge);
    const isControllingStateExternally = isOpen !== undefined;
    const isFlyoutOpen = isControllingStateExternally ? isOpen : isFlyoutOpenInternal;

    const [uploadFile, { results: uploadResults, doneAll }] = useAssetUpload({
        onUploadProgress: () => !isUploadLoading && setIsUploadLoading(true),
    });

    const handleFlyoutOpenChange = (isOpen: boolean) => {
        const stateSetter = isControllingStateExternally ? onOpenChange : setIsFlyoutOpenInternal;

        stateSetter?.(isOpen);
    };

    useEffect(() => {
        setInternalItems(items);
    }, [items]);

    useEffect(() => {
        if (selectedFiles) {
            setIsUploadLoading(true);
            uploadFile(selectedFiles);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedFiles]);

    useEffect(() => {
        const uploadDone = async () => {
            if (doneAll) {
                await onUpload(uploadResults);
                setIsUploadLoading(false);
            }
        };
        uploadDone();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [doneAll, uploadResults]);

    const onOpenAssetChooser = () => {
        handleFlyoutOpenChange(false);
        appBridge.openAssetChooser(
            (result: Asset[]) => {
                onBrowse(result);
                appBridge.closeAssetChooser();
                handleFlyoutOpenChange(true);
            },
            {
                multiSelection: true,
                selectedValueIds: internalItems.map((internalItem) => internalItem.id),
            },
        );
    };

    const onReplaceItemWithBrowse = (toReplace: Asset) => {
        handleFlyoutOpenChange(false);
        appBridge.openAssetChooser(
            async (result: Asset[]) => {
                handleFlyoutOpenChange(true);
                appBridge.closeAssetChooser();
                setAssetIdsLoading([...assetIdsLoading, toReplace.id]);
                await onReplaceWithBrowse(toReplace, result[0]);
                setAssetIdsLoading(assetIdsLoading.filter((id) => id !== toReplace.id));
            },
            {
                multiSelection: false,
                selectedValueIds: internalItems.map((internalItem) => internalItem.id),
            },
        );
    };

    const onReplaceItemWithUpload = async (toReplace: Asset, uploadedAsset: Asset) => {
        setAssetIdsLoading([...assetIdsLoading, toReplace.id]);
        await onReplaceWithUpload(toReplace, uploadedAsset);
        setAssetIdsLoading(assetIdsLoading.filter((id) => id !== toReplace.id));
    };

    return isEditing || (internalItems?.length ?? 0) > 0 ? (
        <Tooltip
            withArrow
            position={TooltipPosition.Top}
            content="Attachments"
            disabled={isFlyoutOpen}
            enterDelay={500}
            triggerElement={
                <div data-test-id="attachments-flyout-button">
                    <Flyout
                        placement={FlyoutPlacement.BottomRight}
                        onOpenChange={handleFlyoutOpenChange}
                        isOpen={isFlyoutOpen}
                        hug={false}
                        fitContent
                        legacyFooter={false}
                        trigger={
                            <TriggerComponent isFlyoutOpen={isFlyoutOpen}>
                                <div>{items.length > 0 ? items.length : 'Add'}</div>
                            </TriggerComponent>
                        }
                    >
                        <div className="tw-w-[300px]" data-test-id="attachments-flyout-content">
                            {internalItems.length > 0 && (
                                <div className="tw-border-b tw-border-b-line">
                                    {internalItems.map((item) => (
                                        <AttachmentItem
                                            isEditing={isEditing}
                                            isLoading={assetIdsLoading.includes(item.id)}
                                            key={item.id}
                                            item={item}
                                            onDelete={() => onDelete(item)}
                                            onReplaceWithBrowse={() => onReplaceItemWithBrowse(item)}
                                            onReplaceWithUpload={(uploadedAsset: Asset) =>
                                                onReplaceItemWithUpload(item, uploadedAsset)
                                            }
                                            onDownload={() =>
                                                appBridge.dispatch({
                                                    name: 'downloadAsset',
                                                    payload: item,
                                                })
                                            }
                                        />
                                    ))}
                                </div>
                            )}
                            {isEditing && (
                                <div className="tw-px-5 tw-py-3">
                                    <div className="tw-font-body tw-font-medium tw-text-text tw-text-s tw-my-4">
                                        Add attachments
                                    </div>
                                    <AssetInput
                                        isLoading={isUploadLoading}
                                        size={AssetInputSize.Small}
                                        onUploadClick={(fileList) => setSelectedFiles(fileList)}
                                        onLibraryClick={onOpenAssetChooser}
                                    />
                                </div>
                            )}
                        </div>
                    </Flyout>
                </div>
            }
        />
    ) : null;
};
