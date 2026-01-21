/* (c) Copyright Frontify Ltd., all rights reserved. */

import { IconCaretDown, IconPaperclip } from '@frontify/fondue/icons';
import { forwardRef } from 'react';

import { type AttachmentsTriggerProps } from '../../../Attachments/types';
import { BaseToolbarButton } from '../BaseToolbarButton';

export const AttachmentsToolbarButtonTrigger = forwardRef<HTMLButtonElement, AttachmentsTriggerProps>(
    ({ children, isFlyoutOpen, ...props }, ref) => (
        <BaseToolbarButton
            forceActiveStyle={isFlyoutOpen}
            data-test-id="attachments-toolbar-button-trigger"
            ref={ref}
            {...props}
        >
            <IconPaperclip size="16" />
            {children}
            <IconCaretDown size="12" />
        </BaseToolbarButton>
    ),
);

AttachmentsToolbarButtonTrigger.displayName = 'AttachmentsToolbarButtonTrigger';
