/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type ReactNode } from 'react';

export const ToolbarSegment = ({ children }: { children: ReactNode }) => (
    <div className="tw-pointer-events-auto tw-flex tw-flex-shrink-0 tw-gap-px tw-px-px tw-h-[26px] tw-items-center tw-self-start tw-leading-none">
        {children}
    </div>
);
