/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type AttachmentsTriggerProps } from './types';

export const AttachmentsButtonTrigger = ({ children }: AttachmentsTriggerProps) => (
    <div className="tw-flex tw-text-[13px] tw-font-body tw-items-center tw-gap-1 tw-rounded-full tw-bg-box-neutral-strong-inverse hover:tw-bg-box-neutral-strong-inverse-hover active:tw-bg-box-neutral-strong-inverse-pressed tw-text-box-neutral-strong tw-outline tw-outline-1 tw-outline-offset-[1px] tw-p-[6px] tw-outline-line">
        {children}
    </div>
);
