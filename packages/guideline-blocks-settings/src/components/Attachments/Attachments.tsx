/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useEffect, useState } from 'react';
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    KeyboardSensor,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { SortableContext, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable';
import { Asset, useAssetUpload, useEditorState } from '@frontify/app-bridge';
import {
    AssetInput,
    AssetInputSize,
    Flyout,
    FlyoutPlacement,
    IconCaretDown12,
    IconPaperclip16,
    LegacyTooltip as Tooltip,
    TooltipPosition,
} from '@frontify/fondue';
import { AttachmentItem, SortableAttachmentItem } from './AttachmentItem';
import { AttachmentsProps, AttachmentsTriggerComponentProps } from './types';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';

const AttachmentsButtonTrigger = ({ children }: AttachmentsTriggerComponentProps) => (
    <div className="tw-flex tw-text-[13px] tw-font-body tw-items-center tw-gap-1 tw-rounded-full tw-bg-box-neutral-strong-inverse hover:tw-bg-box-neutral-strong-inverse-hover active:tw-bg-box-neutral-strong-inverse-pressed tw-text-box-neutral-strong tw-outline tw-outline-1 tw-outline-offset-[1px] tw-p-[6px] tw-outline-line">
        {children}
    </div>
);

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
    const isControllingStateExternally = isOpen !== undefined;
    const isFlyoutOpen = isControllingStateExternally ? isOpen : isFlyoutOpenInternal;

    const draggedItem = internalItems?.find((item) => item.id === draggedAssetId);

    const [uploadFile, { results: uploadResults, doneAll }] = useAssetUpload({
        onUploadProgress: () => !isUploadLoading && setIsUploadLoading(true),
    });

    const handleFlyoutOpenChange = (isOpen: boolean) => {
        const stateSetter = isControllingStateExternally ? onOpenChange! : setIsFlyoutOpenInternal;

        stateSetter(isOpen);
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
                        onOpenChange={(isOpen) => handleFlyoutOpenChange(!!draggedItem ? true : isOpen)}
                        isOpen={isFlyoutOpen}
                        hug={false}
                        fitContent
                        legacyFooter={false}
                        trigger={
                            <TriggerComponent>
                                <IconPaperclip16 />
                                <div>{items.length > 0 ? items.length : 'Add'}</div>
                                <IconCaretDown12 />
                            </TriggerComponent>
                        }
                    >
                        <div className="tw-w-[300px]">
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
            }
        />
    ) : null;
};
