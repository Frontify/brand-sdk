/* (c) Copyright Frontify Ltd., all rights reserved. */

import {
    ActionMenu,
    Flyout,
    IconArrowCircleUp20,
    IconExclamationMarkTriangle,
    IconImageStack20,
    LoadingCircle,
    MenuItemContentSize,
} from '@frontify/fondue';
import { DragEventHandler, MouseEventHandler, useRef, useState } from 'react';
import { joinClassNames } from '../../utilities/react/joinClassNames';
import { BlockInjectButtonProps } from './types';
import { FileExtension, FileExtensionSets } from '@frontify/app-bridge';

export const BlockInjectButton = ({
    onDrop,
    label,
    icon,
    secondaryLabel,
    isLoading,
    fillParentContainer,
    onAssetChooseClick,
    onUploadClick,
    withMenu = true,
    onClick,
    validFileType,
    verticalLayout,
}: BlockInjectButtonProps) => {
    const [isDraggingOver, setIsDraggingOver] = useState(false);
    const [menuPosition, setMenuPosition] = useState<[number, number] | undefined>();
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [errorMsg, setErrorMsg] = useState<string | undefined>(undefined);

    const handleDrop: DragEventHandler<HTMLButtonElement> = (event) => {
        event.preventDefault();
        setIsDraggingOver(false);
        if (!isValidAsset(event.dataTransfer.files)) {
            setErrorMsg('Invalid');
            setTimeout(() => {
                setErrorMsg(undefined);
            }, 1000);
            return;
        }
        onDrop?.(event.dataTransfer.files);
    };

    const isValidAsset = (files: FileList) => {
        if (!validFileType) {
            return true;
        }
        for (let i = 0; i < files.length; i++) {
            const droppedFileExtension = (files[i].name.split('.').pop() ?? '') as FileExtension;
            if (!FileExtensionSets[validFileType].includes(droppedFileExtension)) {
                return false;
            }
        }
        return true;
    };

    const openMenu: MouseEventHandler<HTMLButtonElement> = (event) => {
        if (!buttonRef.current || isLoading) {
            return;
        }
        const { left, top } = buttonRef.current.getBoundingClientRect();
        const XInsideComponent = event.clientX - left;
        const YInsideComponent = event.clientY - top;
        setMenuPosition([XInsideComponent, YInsideComponent]);
    };

    return (
        <button
            ref={buttonRef}
            data-test-id="block-inject-button"
            className={joinClassNames([
                'tw-font-body tw-relative tw-text-sm tw-leading-4 tw-border tw-flex tw-items-center tw-justify-center tw-cursor-pointer tw-gap-3 tw-w-full first:tw-rounded-tl last:tw-rounded-br',
                verticalLayout
                    ? '[&:not(:first-child)]:tw-border-t-0 first:tw-rounded-tr last:tw-rounded-bl'
                    : '[&:not(:first-child)]:tw-border-l-0  first:tw-rounded-bl last:tw-rounded-tr',
                fillParentContainer ? 'tw-h-full' : 'tw-h-[72px]',
                isDraggingOver && !isLoading ? 'tw-border-dashed' : 'tw-border-solid',
                menuPosition && 'tw-bg-blank-state-pressed-inverse',
                isDraggingOver && 'tw-bg-blank-state-weak-inverse',
                errorMsg ? '!tw-border-red-50 !tw-cursor-not-allowed' : ' tw-border-blank-state-line',
                isLoading || menuPosition || isDraggingOver || errorMsg
                    ? ''
                    : 'tw-text-text-weak hover:tw-text-blank-state-hover hover:tw-bg-blank-state-hover-inverse hover:tw-border-blank-state-line-hover active:tw-text-blank-state-pressed active:tw-bg-blank-state-pressed-inverse active:tw-border-blank-state-line-hover',
                (isDraggingOver || !!menuPosition) && !errorMsg
                    ? '[&>*]:tw-pointer-events-none tw-border-blank-state-line-hover'
                    : 'tw-bg-blank-state-shaded-inverse tw-text-blank-state-shaded',
            ])}
            onDragEnter={
                onDrop
                    ? (event) => {
                          setIsDraggingOver(true);
                          // is now only used for images, can be adapted if needed
                          if (validFileType === 'Images') {
                              for (const item of Array.from(event.dataTransfer.items)) {
                                  if (!item?.type?.startsWith('image/')) {
                                      setErrorMsg('Invalid');
                                  } else {
                                      setErrorMsg(undefined);
                                  }
                              }
                          }
                      }
                    : undefined
            }
            onDragLeave={
                onDrop
                    ? () => {
                          setIsDraggingOver(false);
                          setErrorMsg(undefined);
                      }
                    : undefined
            }
            onDrop={onDrop ? handleDrop : undefined}
            onClick={(event) => {
                withMenu && openMenu(event);
                onClick?.();
            }}
        >
            {isLoading ? (
                <LoadingCircle />
            ) : // eslint-disable-next-line unicorn/no-nested-ternary
            errorMsg ? (
                <div className=" tw-flex tw-items-center tw-justify-center tw-text-red-60 tw-font-medium">
                    <IconExclamationMarkTriangle />
                    {errorMsg}
                </div>
            ) : (
                <>
                    {icon && <div>{icon}</div>}
                    {(label || secondaryLabel) && (
                        <div className="tw-flex tw-flex-col tw-items-start">
                            {label && <div className="tw-font-medium">{label}</div>}
                            {secondaryLabel && <div className="tw-font-normal">{secondaryLabel}</div>}
                        </div>
                    )}
                </>
            )}
            {menuPosition && (
                <div
                    className="tw-absolute tw-left-0 tw-top-full tw-z-20"
                    style={{
                        left: menuPosition[0],
                        top: menuPosition[1],
                    }}
                >
                    <Flyout
                        onOpenChange={(isOpen) => !isOpen && setMenuPosition(undefined)}
                        isOpen={true}
                        fitContent
                        hug={false}
                        legacyFooter={false}
                        trigger={<div />}
                    >
                        <ActionMenu
                            menuBlocks={[
                                {
                                    id: 'menu',
                                    menuItems: [
                                        ...(onUploadClick
                                            ? [
                                                  {
                                                      id: 'upload',
                                                      size: MenuItemContentSize.XSmall,
                                                      title: 'Upload asset',
                                                      onClick: () => {
                                                          onUploadClick();
                                                          setMenuPosition(undefined);
                                                      },

                                                      initialValue: true,
                                                      decorator: (
                                                          <div className="tw-mr-2">
                                                              <IconArrowCircleUp20 />
                                                          </div>
                                                      ),
                                                  },
                                              ]
                                            : []),
                                        ...(onAssetChooseClick
                                            ? [
                                                  {
                                                      id: 'asset',
                                                      size: MenuItemContentSize.XSmall,
                                                      title: 'Browse asset',
                                                      onClick: () => {
                                                          onAssetChooseClick();
                                                          setMenuPosition(undefined);
                                                      },
                                                      initialValue: true,
                                                      decorator: (
                                                          <div className="tw-mr-2">
                                                              <IconImageStack20 />
                                                          </div>
                                                      ),
                                                  },
                                              ]
                                            : []),
                                    ],
                                },
                            ]}
                        />
                    </Flyout>
                </div>
            )}
        </button>
    );
};
