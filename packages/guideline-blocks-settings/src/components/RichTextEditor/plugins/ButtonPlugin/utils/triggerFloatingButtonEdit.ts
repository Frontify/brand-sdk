/* (c) Copyright Frontify Ltd., all rights reserved. */

import { PlateEditor, Value, findNode, getEditorString, getPluginType } from '@udecode/plate';
import { ELEMENT_BUTTON, TButtonElement } from '..';
import { floatingButtonActions } from '../components/FloatingButton/floatingButtonStore';

export const triggerFloatingButtonEdit = <V extends Value>(editor: PlateEditor<V>) => {
    const entry = findNode<TButtonElement>(editor, {
        match: { type: getPluginType(editor, ELEMENT_BUTTON) },
    });
    if (!entry) {
        return;
    }

    const [link, path] = entry;

    let text = getEditorString(editor, path);

    floatingButtonActions.url(link.url);

    floatingButtonActions.newTab(link.target === undefined);

    if (text === link.url) {
        text = '';
    }

    floatingButtonActions.text(text);

    floatingButtonActions.isEditing(true);
};
