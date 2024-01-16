/* (c) Copyright Frontify Ltd., all rights reserved. */

import { MutableRefObject, useEffect, useState } from 'react';
import { Asset, useAssetUpload, useFileInput } from '@frontify/app-bridge';

import {
    ActionMenu,
    Button,
    ButtonEmphasis,
    Flyout,
    FlyoutPlacement,
    IconArrowCircleUp20,
    IconDocument24,
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
import { AttachmentItemProps } from './types';
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

export const AttachmentItem = ({
    item,
    isEditing,
    isLoading,
    onDelete,
    onReplaceWithBrowse,
    onReplaceWithUpload,
    onDownload,
}: AttachmentItemProps) => {
    const [selectedAsset, setSelectedAsset] = useState<Asset | undefined>();
    const [openFileDialog, { selectedFiles }] = useFileInput({ multiple: true, accept: 'image/*' });
    const [uploadFile, { results: uploadResults, doneAll }] = useAssetUpload();

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
            onClick={() => onDownload?.()}
            style={{
                fontFamily: 'var(-f-theme-settings-body-font-family)',
            }}
            className={joinClassNames([
                'tw-cursor-pointer tw-text-left tw-w-full tw-relative tw-flex tw-gap-3 tw-px-5 tw-py-3 tw-items-center tw-group hover:tw-bg-box-neutral-hover',
            ])}
        >
            <div className="tw-text-text-weak group-hover:tw-text-box-neutral-inverse-hover">
                {showLoadingCircle ? <LoadingCircle size={LoadingCircleSize.Small} /> : getDecorator(item.objectType)}
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
                        selectedAsset?.id === item.id ? 'tw-opacity-100' : 'tw-opacity-0',
                    ])}
                >
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
};
