/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type AppBridgeBlock, type Asset } from '@frontify/app-bridge';
import { type ReactNode } from 'react';

export type AttachmentsTriggerProps = {
    children: ReactNode;
    isFlyoutOpen: boolean;
};

export type AttachmentsProps = {
    items?: Asset[];
    appBridge: AppBridgeBlock;
    onReplaceWithUpload: (attachmentToReplace: Asset, newAsset: Asset) => Promise<void>;
    onReplaceWithBrowse: (attachmentToReplace: Asset, newAsset: Asset) => Promise<void>;
    onDelete: (attachmentToDelete: Asset) => void;
    onUpload: (uploadedAttachments: Asset[]) => Promise<void>;
    onBrowse: (browserAttachments: Asset[]) => void;
    onSorted: (sortedAttachments: Asset[]) => void;
    triggerComponent?: React.ForwardRefExoticComponent<
        AttachmentsTriggerProps & React.RefAttributes<HTMLButtonElement>
    >;
} & ({ isOpen?: never; onOpenChange?: never } | { isOpen: boolean; onOpenChange: (isOpen: boolean) => void });

export type AttachmentItemProps = SortableAttachmentItemProps & {
    isDragging?: boolean;
    transformStyle?: Record<string, unknown>;
    draggableProps?: Record<string, unknown>;
    isOverlay?: boolean;
};

export type SortableAttachmentItemProps = {
    item: Asset;
    isEditing: boolean;
    onDelete: () => void;
    isLoading?: boolean;
    onReplaceWithBrowse: () => void;
    onReplaceWithUpload: (uploadedAsset: Asset) => void;
    onDownload?: () => Promise<void>;
};
