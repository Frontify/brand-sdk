/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useAttachmentsContext } from '../../../../hooks';
import { Attachments } from '../../../Attachments';
import { useDragPreviewContext } from '../context/DragPreviewContext';
import { useMultiFlyoutState } from '../hooks/useMultiFlyoutState';

import { AttachmentsToolbarButtonTrigger } from './AttachmentsToolbarButtonTrigger';

export const DEFAULT_ATTACHMENTS_BUTTON_ID = 'attachments';

type AttachmentsToolbarButtonProps = { flyoutId?: string };

export const AttachmentsToolbarButton = ({
    flyoutId = DEFAULT_ATTACHMENTS_BUTTON_ID,
}: AttachmentsToolbarButtonProps) => {
    const { appBridge, attachments, onAttachmentsAdd, onAttachmentDelete, onAttachmentReplace, onAttachmentsSorted } =
        useAttachmentsContext();

    const { isOpen, onOpenChange } = useMultiFlyoutState(flyoutId);
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
