/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useSortable } from '@dnd-kit/sortable';
import { type Asset, useAssetUpload, useFileInput } from '@frontify/app-bridge';
import {
    FOCUS_STYLE,
    IconDocument24,
    IconGrabHandle20,
    IconImage24,
    IconMusicNote24,
    IconPlayFrame24,
} from '@frontify/fondue';
import { LoadingCircle, Dropdown, Button } from '@frontify/fondue/components';
import { IconArrowCircleUp, IconImageStack, IconPen, IconTrashBin } from '@frontify/fondue/icons';
import { useFocusRing } from '@react-aria/focus';
import { type MutableRefObject, forwardRef, useEffect, useState } from 'react';

import { joinClassNames } from '../../utilities';

import { type AttachmentItemProps, type SortableAttachmentItemProps } from './types';

const getDecorator = (type: string) => {
    if (type === 'IMAGE') {
        return <IconImage24 />;
    } else if (type === 'VIDEO') {
        return <IconPlayFrame24 />;
    } else if (type === 'AUDIO') {
        return <IconMusicNote24 />;
    } else {
        return <IconDocument24 />;
    }
};

export const AttachmentItem = forwardRef<HTMLButtonElement, AttachmentItemProps>(
    (
        {
            item,
            isEditing,
            draggableProps,
            transformStyle,
            isDragging,
            isOverlay,
            isLoading,
            onDelete,
            onReplaceWithBrowse,
            onReplaceWithUpload,
            onDownload,
        },
        ref,
    ) => {
        const [selectedAsset, setSelectedAsset] = useState<Asset | undefined>();
        const [openFileDialog, { selectedFiles }] = useFileInput({ multiple: true, accept: 'image/*' });
        const [uploadFile, { results: uploadResults, doneAll }] = useAssetUpload();

        const { focusProps, isFocusVisible } = useFocusRing();

        useEffect(() => {
            if (selectedFiles) {
                uploadFile(selectedFiles[0]);
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [selectedFiles]);

        useEffect(() => {
            if (doneAll) {
                onReplaceWithUpload(uploadResults[0]);
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [doneAll, uploadResults]);

        const showLoadingCircle = isLoading || (selectedFiles && !doneAll);

        return (
            <button
                aria-label="Download attachment"
                data-test-id="attachments-item"
                onClick={() => !selectedAsset && onDownload?.()}
                ref={ref}
                style={{
                    ...transformStyle,
                    opacity: isDragging && !isOverlay ? 0.3 : 1,
                    fontFamily: 'var(-f-theme-settings-body-font-family)',
                }}
                className={joinClassNames([
                    'tw-cursor-pointer tw-text-left tw-w-full tw-relative tw-flex tw-gap-3 tw-px-5 tw-py-3 tw-items-center tw-group hover:tw-bg-box-neutral-hover',
                    isDragging ? 'tw-bg-box-neutral-hover' : '',
                ])}
            >
                <div className="tw-text-text-weak group-hover:tw-text-box-neutral-inverse-hover">
                    {showLoadingCircle ? <LoadingCircle size="small" /> : getDecorator(item.objectType)}
                </div>
                <div className="tw-text-s tw-flex-1 tw-min-w-0">
                    <div className="tw-whitespace-nowrap tw-overflow-hidden tw-text-ellipsis tw-font-bold tw-text-text-weak group-hover:tw-text-box-neutral-inverse-hover">
                        {item.title}
                    </div>
                    <div className="tw-text-text-weak">{`${item.fileSizeHumanReadable} - ${item.extension}`}</div>
                </div>
                {isEditing && (
                    <div
                        data-test-id="attachments-actionbar"
                        className={joinClassNames([
                            'tw-flex tw-gap-0.5 group-focus:tw-opacity-100 focus-visible:tw-opacity-100 focus-within:tw-opacity-100 group-hover:tw-opacity-100',
                            isOverlay || selectedAsset?.id === item.id ? 'tw-opacity-100' : 'tw-opacity-0',
                        ])}
                    >
                        <button
                            {...focusProps}
                            {...draggableProps}
                            aria-label="Drag attachment"
                            className={joinClassNames([
                                ' tw-border-button-border tw-bg-button-background active:tw-bg-button-background-pressed tw-group tw-border tw-box-box tw-relative tw-flex tw-items-center tw-justify-center tw-outline-none tw-font-medium tw-rounded tw-h-9 tw-w-9 ',
                                isDragging || isOverlay
                                    ? 'tw-cursor-grabbing tw-bg-button-background-pressed hover:tw-bg-button-background-pressed'
                                    : 'tw-cursor-grab hover:tw-bg-button-background-hover',
                                isFocusVisible && FOCUS_STYLE,
                                isFocusVisible && 'tw-z-[2]',
                            ])}
                        >
                            <IconGrabHandle20 />
                        </button>
                        <div data-test-id="attachments-actionbar-flyout">
                            <Dropdown.Root
                                open={selectedAsset?.id === item.id}
                                onOpenChange={(isOpen) => setSelectedAsset(isOpen ? item : undefined)}
                            >
                                <Dropdown.Trigger>
                                    <Button
                                        aspect="square"
                                        ref={ref as MutableRefObject<HTMLButtonElement>}
                                        onPress={(e) => {
                                            e?.stopPropagation();
                                            e?.preventDefault();
                                        }}
                                        emphasis="default"
                                    >
                                        <IconPen size="20" />
                                    </Button>
                                </Dropdown.Trigger>
                                <Dropdown.Content side="right">
                                    <Dropdown.Group>
                                        <Dropdown.Item
                                            data-test-id="menu-item"
                                            onSelect={(event) => {
                                                event?.stopPropagation();
                                                openFileDialog();
                                                setSelectedAsset(undefined);
                                            }}
                                        >
                                            <IconArrowCircleUp size="20" />
                                            Replace with upload
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                            onSelect={(event) => {
                                                event?.stopPropagation();
                                                onReplaceWithBrowse();
                                                setSelectedAsset(undefined);
                                            }}
                                        >
                                            <IconImageStack size="20" />
                                            Replace with asset
                                        </Dropdown.Item>
                                    </Dropdown.Group>
                                    <Dropdown.Group>
                                        <Dropdown.Item
                                            emphasis="danger"
                                            onSelect={(event) => {
                                                event?.stopPropagation();
                                                onDelete();
                                                setSelectedAsset(undefined);
                                            }}
                                        >
                                            <IconTrashBin size="20" />
                                            Delete
                                        </Dropdown.Item>
                                    </Dropdown.Group>
                                </Dropdown.Content>
                            </Dropdown.Root>
                        </div>
                    </div>
                )}
            </button>
        );
    },
);

AttachmentItem.displayName = 'AttachmentItem';

export const SortableAttachmentItem = (props: SortableAttachmentItemProps) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: props.item.id,
    });

    const transformStyle = {
        transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : '',
        transition,
        zIndex: isDragging ? 2 : 1,
    };

    const draggableProps = { ...attributes, ...listeners };

    return (
        <AttachmentItem
            ref={setNodeRef}
            isDragging={isDragging}
            transformStyle={transformStyle}
            draggableProps={draggableProps}
            {...props}
        />
    );
};
