/* (c) Copyright Frontify Ltd., all rights reserved. */

import { PlateEditor, TText, Value, getPluginType } from '@frontify/fondue';
import { RichTextButtonStyle, TButtonElement } from '..';
import { ELEMENT_BUTTON } from '../createButtonPlugin';

export interface CreateButtonNodeOptions {
    url: string;
    text?: string;
    buttonStyle?: RichTextButtonStyle;
    target?: string;
    children?: TText[];
}

export const createButtonNode = <V extends Value>(
    editor: PlateEditor<V>,
    { url, text = '', buttonStyle = 'primary', target, children }: CreateButtonNodeOptions,
): TButtonElement => {
    const type = getPluginType(editor, ELEMENT_BUTTON);

    return {
        type,
        url,
        target,
        buttonStyle,
        children: children ?? [{ text }],
    };
};
