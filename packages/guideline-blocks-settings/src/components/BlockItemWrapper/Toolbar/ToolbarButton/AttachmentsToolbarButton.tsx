/* (c) Copyright Frontify Ltd., all rights reserved. */

import { Attachments } from '../../../Attachments';
import { useAttachmentsContext } from '../../../../hooks';

import { AttachmentsToolbarButtonTrigger } from './AttachmentsToolbarButtonTrigger';
import { useToolbarFlyoutState } from '../hooks/useToolbarFlyoutState';
import { useMemoizedId } from '@frontify/fondue';

export const AttachmentsToolbarButton = () => {
    const id = useMemoizedId();

    const { appBridge, attachments, onAttachmentsAdd, onAttachmentDelete, onAttachmentReplace, onAttachmentsSorted } =
        useAttachmentsContext();

    const { isOpen, onOpenChange } = useToolbarFlyoutState(id);

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
            isOpen={isOpen}
            onOpenChange={onOpenChange}
        />
    );
};
