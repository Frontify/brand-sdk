/* (c) Copyright Frontify Ltd., all rights reserved. */

import {
    type PlateEditor,
    type TText,
    type Value,
    getAboveNode,
    getEditorString,
    getPluginType,
    replaceNodeChildren,
} from '@frontify/fondue';

import { ELEMENT_BUTTON, type TButtonElement } from '..';

import { type UpsertButtonOptions } from './upsertButton';

/**
 * If the text is different than the button above text, replace button children by a new text.
 * The new text has the same marks than the first text replaced.
 */
export const upsertButtonText = <V extends Value>(editor: PlateEditor<V>, { text }: UpsertButtonOptions<V>) => {
    const newButton = getAboveNode<TButtonElement>(editor, {
        match: { type: getPluginType(editor, ELEMENT_BUTTON) },
    });

    if (newButton) {
        const [newButtonNode, newButtonPath] = newButton;

        if (text?.length && text !== getEditorString(editor, newButtonPath)) {
            const firstText = newButtonNode.children[0];

            // remove button children
            replaceNodeChildren<TText>(editor, {
                at: newButtonPath,
                nodes: { ...firstText, text },
                insertOptions: {
                    select: true,
                },
            });
        }
    }
};
