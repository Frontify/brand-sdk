/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useMemoizedId } from '@frontify/fondue';

import { useAttachmentsContext } from '../../../../hooks';
import { Attachments } from '../../../Attachments';
import { useToolbarFlyoutState } from '../hooks/useToolbarFlyoutState';

import { AttachmentsToolbarButtonTrigger } from './AttachmentsToolbarButtonTrigger';

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
