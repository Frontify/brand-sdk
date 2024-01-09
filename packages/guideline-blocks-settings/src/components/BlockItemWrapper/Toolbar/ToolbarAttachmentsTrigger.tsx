/* (c) Copyright Frontify Ltd., all rights reserved. */

import { IconCaretDown12, IconPaperclip16 } from '@frontify/fondue';
import { type AttachmentsTriggerProps } from '../../Attachments/types';

import { getToolbarButtonClassNames } from './helpers';

export const ToolbarAttachmentsTrigger = ({ children, isFlyoutOpen }: AttachmentsTriggerProps) => (
    <div className={getToolbarButtonClassNames('pointer', isFlyoutOpen)}>
        <IconPaperclip16 />
        {children}
        <IconCaretDown12 />
    </div>
);
