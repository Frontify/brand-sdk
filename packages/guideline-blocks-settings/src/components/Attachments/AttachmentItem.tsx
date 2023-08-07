/* (c) Copyright Frontify Ltd., all rights reserved. */

import { MutableRefObject, forwardRef, useEffect, useState } from 'react';
import { Asset, useAssetUpload, useFileInput } from '@frontify/app-bridge';
import { useSortable } from '@dnd-kit/sortable';
import { useFocusRing } from '@react-aria/focus';

import {
    ActionMenu,
    Button,
    ButtonEmphasis,
    FOCUS_STYLE,
    Flyout,
    FlyoutPlacement,
    IconArrowCircleUp20,
    IconDocument24,
    IconGrabHandle20,
    IconImage24,
    IconImageStack20,
    IconMusicNote24,
    IconPen20,
    IconPlayFrame24,
    IconTrashBin20,
    LoadingCircle,
    LoadingCircleSize,
    MenuItemContentSize,
    MenuItemStyle,
} from '@frontify/fondue';
import { AttachmentItemProps, SortableAttachmentItemProps } from './types';
import { joinClassNames } from '../../utilities';

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

        const download = (url: string, filename: string) => {
            fetch(url).then((response) => {
                response.blob().then((blob) => {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = filename;
                    a.click();
                });
            });
        };

        const showLoadingCircle = isLoading || (selectedFiles && !doneAll);

        return (
            <button
                aria-label="Download attachment"
                data-test-id="attachments-item"
                onClick={() => download(item.genericUrl, item.fileName)}
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
                    {showLoadingCircle ? (
                        <LoadingCircle size={LoadingCircleSize.Small} />
                    ) : (
                        getDecorator(item.objectType)
                    )}
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
                            <Flyout
                                placement={FlyoutPlacement.Right}
                                isOpen={selectedAsset?.id === item.id}
                                fitContent
                                legacyFooter={false}
                                onOpenChange={(isOpen) => setSelectedAsset(isOpen ? item : undefined)}
                                trigger={(_, ref) => (
                                    <Button
                                        ref={ref as MutableRefObject<HTMLButtonElement>}
                                        icon={<IconPen20 />}
                                        emphasis={ButtonEmphasis.Default}
                                        onClick={() => setSelectedAsset(item)}
                                    />
                                )}
                            >
                                <ActionMenu
                                    menuBlocks={[
                                        {
                                            id: 'menu',
                                            menuItems: [
                                                {
                                                    id: 'upload',
                                                    size: MenuItemContentSize.XSmall,
                                                    title: 'Replace with upload',
                                                    onClick: () => {
                                                        openFileDialog();
                                                        setSelectedAsset(undefined);
                                                    },

                                                    initialValue: true,
                                                    decorator: (
                                                        <div className="tw-mr-2">
                                                            <IconArrowCircleUp20 />
                                                        </div>
                                                    ),
                                                },

                                                {
                                                    id: 'asset',
                                                    size: MenuItemContentSize.XSmall,
                                                    title: 'Replace with asset',
                                                    onClick: () => {
                                                        onReplaceWithBrowse();
                                                        setSelectedAsset(undefined);
                                                    },
                                                    initialValue: true,
                                                    decorator: (
                                                        <div className="tw-mr-2">
                                                            <IconImageStack20 />
                                                        </div>
                                                    ),
                                                },
                                            ],
                                        },
                                        {
                                            id: 'menu-delete',
                                            menuItems: [
                                                {
                                                    id: 'delete',
                                                    size: MenuItemContentSize.XSmall,
                                                    title: 'Delete',
                                                    style: MenuItemStyle.Danger,
                                                    onClick: () => {
                                                        onDelete();
                                                        setSelectedAsset(undefined);
                                                    },

                                                    initialValue: true,
                                                    decorator: (
                                                        <div className="tw-mr-2">
                                                            <IconTrashBin20 />
                                                        </div>
                                                    ),
                                                },
                                            ],
                                        },
                                    ]}
                                />
                            </Flyout>
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
