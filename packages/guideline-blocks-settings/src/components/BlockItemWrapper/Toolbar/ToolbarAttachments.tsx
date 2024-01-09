/* (c) Copyright Frontify Ltd., all rights reserved. */

import { Attachments } from '../../Attachments';
import { useAttachmentsContext } from '../../../hooks';

import { type ToolbarFlyoutState } from './types';

import { ToolbarAttachmentsTrigger } from './ToolbarAttachmentsTrigger';

export const ToolbarAttachments = ({ isOpen, onOpenChange }: ToolbarFlyoutState) => {
    const { appBridge, attachments, onAddAttachments, onAttachmentDelete, onAttachmentReplace, onAttachmentsSorted } =
        useAttachmentsContext();

    return (
        <Attachments
            onUpload={onAddAttachments}
            onDelete={onAttachmentDelete}
            onReplaceWithBrowse={onAttachmentReplace}
            onReplaceWithUpload={onAttachmentReplace}
            onSorted={onAttachmentsSorted}
            onBrowse={onAddAttachments}
            items={attachments}
            appBridge={appBridge}
            triggerComponent={ToolbarAttachmentsTrigger}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
        />
    );
};
