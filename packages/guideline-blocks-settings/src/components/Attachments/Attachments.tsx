/* (c) Copyright Frontify Ltd., all rights reserved. */

import {
    DndContext,
    type DragEndEvent,
    DragOverlay,
    type DragStartEvent,
    KeyboardSensor,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { SortableContext, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable';
import { type Asset, useAssetChooser, useAssetUpload, useEditorState } from '@frontify/app-bridge';
import { AssetInput, AssetInputSize, Flyout, FlyoutPlacement } from '@frontify/fondue';
import { Tooltip } from '@frontify/fondue/components';
import { type MutableRefObject, useEffect, useState } from 'react';

import { AttachmentItem, SortableAttachmentItem } from './AttachmentItem';
import { AttachmentsButtonTrigger } from './AttachmentsButtonTrigger';
import { type AttachmentsProps } from './types';

export const Attachments = ({
    items = [],
    onDelete,
    onReplaceWithBrowse,
    onReplaceWithUpload,
    onBrowse,
    onUpload,
    onSorted,
    appBridge,
    triggerComponent: TriggerComponent = AttachmentsButtonTrigger,
    isOpen,
    onOpenChange,
}: AttachmentsProps) => {
    const [internalItems, setInternalItems] = useState<Asset[]>(items);
    const [isFlyoutOpenInternal, setIsFlyoutOpenInternal] = useState(false);
    const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));
    const [draggedAssetId, setDraggedAssetId] = useState<number | undefined>(undefined);
    const [isUploadLoading, setIsUploadLoading] = useState(false);
    const [assetIdsLoading, setAssetIdsLoading] = useState<number[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
    const isEditing = useEditorState(appBridge);
    const { openAssetChooser, closeAssetChooser } = useAssetChooser(appBridge);
    const isControllingStateExternally = isOpen !== undefined;
    const isFlyoutOpen = isControllingStateExternally ? isOpen : isFlyoutOpenInternal;

    const draggedItem = internalItems?.find((item) => item.id === draggedAssetId);

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
        openAssetChooser(
            (result: Asset[]) => {
                onBrowse(result);
                closeAssetChooser();
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
        openAssetChooser(
            async (result: Asset[]) => {
                handleFlyoutOpenChange(true);
                closeAssetChooser();
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

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        setDraggedAssetId(active.id as number);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id && internalItems) {
            const oldIndex = internalItems.findIndex((i) => i.id === active.id);
            const newIndex = internalItems.findIndex((i) => i.id === over.id);
            const sortedItems = arrayMove(internalItems, oldIndex, newIndex);
            setInternalItems(sortedItems);
            onSorted(sortedItems);
        }
        setDraggedAssetId(undefined);
    };

    return isEditing || (internalItems?.length ?? 0) > 0 ? (
        <Tooltip.Root enterDelay={500}>
            <Tooltip.Trigger>
                <div data-test-id="attachments-flyout-button">
                    <Flyout
                        placement={FlyoutPlacement.BottomRight}
                        onOpenChange={(isOpen) => handleFlyoutOpenChange(draggedItem ? true : isOpen)}
                        isOpen={isFlyoutOpen}
                        hug={false}
                        fitContent
                        legacyFooter={false}
                        trigger={(triggerProps, triggerRef) => (
                            <TriggerComponent
                                isFlyoutOpen={isFlyoutOpen}
                                triggerProps={triggerProps}
                                triggerRef={triggerRef as MutableRefObject<HTMLButtonElement>}
                            >
                                <div>{items.length > 0 ? items.length : 'Add'}</div>
                            </TriggerComponent>
                        )}
                    >
                        <div className="tw-w-[300px]" data-test-id="attachments-flyout-content">
                            {internalItems.length > 0 && (
                                <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragStart={handleDragStart}
                                    onDragEnd={handleDragEnd}
                                    modifiers={[restrictToWindowEdges]}
                                >
                                    <SortableContext items={internalItems} strategy={rectSortingStrategy}>
                                        <div className="tw-border-b tw-border-b-line">
                                            {internalItems.map((item) => (
                                                <SortableAttachmentItem
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
                                    </SortableContext>
                                    <DragOverlay>
                                        {draggedItem && (
                                            <AttachmentItem
                                                isOverlay={true}
                                                isEditing={isEditing}
                                                key={draggedAssetId}
                                                item={draggedItem}
                                                isDragging={true}
                                                onDelete={() => onDelete(draggedItem)}
                                                onReplaceWithBrowse={() => onReplaceItemWithBrowse(draggedItem)}
                                                onReplaceWithUpload={(uploadedAsset: Asset) =>
                                                    onReplaceItemWithUpload(draggedItem, uploadedAsset)
                                                }
                                            />
                                        )}
                                    </DragOverlay>
                                </DndContext>
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
            </Tooltip.Trigger>
            <Tooltip.Content side="top">Attachments</Tooltip.Content>
        </Tooltip.Root>
    ) : null;
};
