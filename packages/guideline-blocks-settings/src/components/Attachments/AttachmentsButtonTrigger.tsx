/* (c) Copyright Frontify Ltd., all rights reserved. */

import { Button } from '@frontify/fondue/components';
import { IconCaretDown, IconPaperclip } from '@frontify/fondue/icons';
import { forwardRef } from 'react';

import { type AttachmentsTriggerProps } from './types';

export const AttachmentsButtonTrigger = forwardRef<HTMLButtonElement, AttachmentsTriggerProps>(
    ({ children, ...props }, ref) => (
        <Button
            ref={ref}
            size="small"
            rounding="full"
            emphasis="default"
            data-test-id="attachments-button-trigger"
            className="tw-body-medium"
            {...props}
            aria-haspopup="menu"
        >
            <IconPaperclip size="16" />
            {children}
            <IconCaretDown size="12" />
        </Button>
    ),
);

AttachmentsButtonTrigger.displayName = 'AttachmentsButtonTrigger';
