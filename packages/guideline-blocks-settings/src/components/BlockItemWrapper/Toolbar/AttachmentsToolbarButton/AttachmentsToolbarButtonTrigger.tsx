/* (c) Copyright Frontify Ltd., all rights reserved. */

import { IconCaretDown12, IconPaperclip16 } from '@frontify/fondue';

import { type AttachmentsTriggerProps } from '../../../Attachments/types';
import { BaseToolbarButton } from '../BaseToolbarButton';

export const AttachmentsToolbarButtonTrigger = ({
    children,
    isFlyoutOpen,
    triggerProps,
    triggerRef,
}: AttachmentsTriggerProps) => (
    <BaseToolbarButton
        forceActiveStyle={isFlyoutOpen}
        data-test-id="attachments-toolbar-button-trigger"
        {...triggerProps}
        ref={triggerRef}
    >
        <IconPaperclip16 />
        {children}
        <IconCaretDown12 />
    </BaseToolbarButton>
);
