/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type AttachmentsTriggerProps } from '../../Attachments/types';

import { getToolbarButtonClassNames } from './helpers';

export const ToolbarAttachmentsTrigger = ({ children, isFlyoutOpen }: AttachmentsTriggerProps) => (
    <div className={getToolbarButtonClassNames('pointer', isFlyoutOpen)}>{children}</div>
);
