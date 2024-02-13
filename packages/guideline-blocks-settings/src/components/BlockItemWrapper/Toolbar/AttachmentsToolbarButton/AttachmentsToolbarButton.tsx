/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useMemoizedId } from '@frontify/fondue';

import { useAttachmentsContext } from '../../../../hooks';
import { Attachments } from '../../../Attachments';
import { useToolbarFlyoutState } from '../hooks/useToolbarFlyoutState';

import { AttachmentsToolbarButtonTrigger } from './AttachmentsToolbarButtonTrigger';
import { useDragPreviewContext } from '../context/DragPreviewContext';

export const DEFAULT_ATTACHMENTS_BUTTON_ID = 'attachments';

type AttachmentsToolbarButtonProps = { flyoutId?: string };

export const AttachmentsToolbarButton = ({
    flyoutId = DEFAULT_ATTACHMENTS_BUTTON_ID,
}: AttachmentsToolbarButtonProps) => {
    const id = useMemoizedId(flyoutId);

    const { appBridge, attachments, onAttachmentsAdd, onAttachmentDelete, onAttachmentReplace, onAttachmentsSorted } =
        useAttachmentsContext();

    const { isOpen, onOpenChange } = useToolbarFlyoutState(id);
    const isDragPreview = useDragPreviewContext();

    return (
        <Attachments
            onUpload={onAttachmentsAdd}
            onDelete={onAttachmentDelete}
            onReplaceWithBrowse={onAttachmentReplace}
            onReplaceWithUpload={onAttachmentReplace}
            onSorted={onAttachmentsSorted}
            onBrowse={onAttachmentsAdd}
            items={attachments}
            appBridge={appBridge}
            triggerComponent={AttachmentsToolbarButtonTrigger}
            isOpen={isOpen && !isDragPreview}
            onOpenChange={onOpenChange}
        />
    );
};
