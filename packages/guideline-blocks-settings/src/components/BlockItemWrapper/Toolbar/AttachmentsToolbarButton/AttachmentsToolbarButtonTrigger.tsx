/* (c) Copyright Frontify Ltd., all rights reserved. */

import { IconCaretDown12, IconPaperclip16 } from '@frontify/fondue';
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
            <IconPaperclip16 />
            {children}
            <IconCaretDown12 />
        </BaseToolbarButton>
    ),
);

AttachmentsToolbarButtonTrigger.displayName = 'AttachmentsToolbarButtonTrigger';
