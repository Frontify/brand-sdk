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
                'tw-flex tw-text-xs tw-font-body tw-items-center tw-gap-1 tw-rounded-full tw-outline tw-outline-1 tw-outline-offset-1 tw-p-1.5 tw-outline-line',
                isFlyoutOpen
                    ? 'tw-bg-box-neutral-pressed tw-text-box-neutral-inverse-pressed'
                    : 'tw-bg-base hover:tw-bg-box-neutral-hover active:tw-bg-box-neutral-pressed tw-text-box-neutral-inverse hover:tw-text-box-neutral-inverse-hover active:tw-text-box-neutral-inverse-pressed',
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
