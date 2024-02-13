/* (c) Copyright Frontify Ltd., all rights reserved. */

import { PlateEditor } from '@udecode/plate-core';
import { getAboveNode } from '@udecode/slate';
import { ELEMENT_BUTTON, RichTextButtonStyle, TButtonElement } from '..';

export const getButtonStyle = (editor: PlateEditor): RichTextButtonStyle => {
    const linkNode = getAboveNode<TButtonElement>(editor, { match: { type: ELEMENT_BUTTON } });

    if (!Array.isArray(linkNode)) {
        return 'primary';
    }

    return (linkNode[0]?.buttonStyle as RichTextButtonStyle) || 'primary';
};
