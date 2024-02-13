/* (c) Copyright Frontify Ltd., all rights reserved. */

import { PlateEditor, getPluginType } from '@udecode/plate-core';
import { TText, Value, getAboveNode, getEditorString } from '@udecode/slate';
import { replaceNodeChildren } from '@udecode/slate-utils';
import { ELEMENT_BUTTON, TButtonElement } from '..';
import { UpsertButtonOptions } from './upsertButton';

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
