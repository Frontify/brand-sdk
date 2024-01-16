/* (c) Copyright Frontify Ltd., all rights reserved. */

import { Attachments } from '../../Attachments';
import { useAttachmentsContext } from '../../../hooks';

import { type ToolbarFlyoutState } from './types';

import { ToolbarAttachmentsTrigger } from './ToolbarAttachmentsTrigger';

export const ToolbarAttachments = ({ isOpen, onOpenChange }: ToolbarFlyoutState) => {
    const { appBridge, attachments, onAttachmentsAdd, onAttachmentDelete, onAttachmentReplace } =
        useAttachmentsContext();

    return (
        <Attachments
            onUpload={onAttachmentsAdd}
            onDelete={onAttachmentDelete}
            onReplaceWithBrowse={onAttachmentReplace}
            onReplaceWithUpload={onAttachmentReplace}
            onBrowse={onAttachmentsAdd}
            items={attachments}
            appBridge={appBridge}
            triggerComponent={ToolbarAttachmentsTrigger}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
        />
    );
};
