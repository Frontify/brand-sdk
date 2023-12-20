/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type PlateEditor, getAboveNode } from '@udecode/plate';

import { ELEMENT_BUTTON, type RichTextButtonStyle, type TButtonElement } from '..';

export const getButtonStyle = (editor: PlateEditor): RichTextButtonStyle => {
    const linkNode = getAboveNode<TButtonElement>(editor, { match: { type: ELEMENT_BUTTON } });

    if (!Array.isArray(linkNode)) {
        return 'primary';
    }

    return (linkNode[0]?.buttonStyle as RichTextButtonStyle) || 'primary';
};
