/* (c) Copyright Frontify Ltd., all rights reserved. */

import { IconCaretDown12, IconPaperclip16 } from '@frontify/fondue';

import { joinClassNames } from '../../utilities';

import { type AttachmentsTriggerProps } from './types';

export const AttachmentsButtonTrigger = ({
    children,
    isFlyoutOpen,
    triggerProps,
    triggerRef,
}: AttachmentsTriggerProps) => (
    <button
        className={joinClassNames([
            'tw-flex tw-text-xs tw-font-body tw-items-center tw-gap-1 tw-rounded-full tw-outline tw-outline-1 tw-outline-offset-1 tw-p-1.5 tw-outline-line',
            isFlyoutOpen
                ? 'tw-bg-box-neutral-pressed tw-text-box-neutral-inverse-pressed'
                : 'tw-bg-base hover:tw-bg-box-neutral-hover active:tw-bg-box-neutral-pressed tw-text-box-neutral-inverse hover:tw-text-box-neutral-inverse-hover active:tw-text-box-neutral-inverse-pressed',
        ])}
        {...triggerProps}
        ref={triggerRef}
        data-test-id="attachments-button-trigger"
    >
        <IconPaperclip16 />
        {children}
        <IconCaretDown12 />
    </button>
);
