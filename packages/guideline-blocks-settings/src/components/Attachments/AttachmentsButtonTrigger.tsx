/* (c) Copyright Frontify Ltd., all rights reserved. */

import { IconCaretDown, IconPaperclip } from '@frontify/fondue/icons';
import { forwardRef } from 'react';

import { joinClassNames } from '../../utilities';

import { type AttachmentsTriggerProps } from './types';

export const AttachmentsButtonTrigger = forwardRef<HTMLButtonElement, AttachmentsTriggerProps>(
    ({ children, isFlyoutOpen, ...props }, ref) => (
        <button
            ref={ref}
            className={joinClassNames([
                'tw-flex tw-text-x-small tw-font-primary tw-items-center tw-gap-1 tw-rounded-full tw-outline tw-outline-1 tw-outline-offset-1 tw-p-1.5 tw-outline-line-mid',
                isFlyoutOpen
                    ? 'tw-bg-container-secondary-active tw-text-container-secondary-on-secondary-container'
                    : 'tw-bg-surface hover:tw-bg-container-secondary-hover active:tw-bg-container-secondary-active tw-text-container-secondary-on-secondary-container hover:tw-text-container-secondary-on-secondary-container active:tw-text-container-secondary-on-secondary-container',
            ])}
            data-test-id="attachments-button-trigger"
            {...props}
        >
            <IconPaperclip size="16" />
            {children}
            <IconCaretDown size="12" />
        </button>
    ),
);

AttachmentsButtonTrigger.displayName = 'AttachmentsButtonTrigger';
