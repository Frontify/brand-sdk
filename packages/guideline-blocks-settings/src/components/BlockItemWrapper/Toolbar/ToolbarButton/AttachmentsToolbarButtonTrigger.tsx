/* (c) Copyright Frontify Ltd., all rights reserved. */

import { IconCaretDown12, IconPaperclip16 } from '@frontify/fondue';
import { type AttachmentsTriggerProps } from '../../../Attachments/types';

import { BaseToolbarButton } from './BaseToolbarButton';

export const AttachmentsToolbarButtonTrigger = ({ children, isFlyoutOpen }: AttachmentsTriggerProps) => (
    <BaseToolbarButton forceActiveStyle={isFlyoutOpen}>
        <IconPaperclip16 />
        {children}
        <IconCaretDown12 />
    </BaseToolbarButton>
);
