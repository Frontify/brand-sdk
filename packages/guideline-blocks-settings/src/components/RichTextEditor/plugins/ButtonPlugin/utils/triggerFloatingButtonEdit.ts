/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type PlateEditor, type Value, findNode, getEditorString, getPluginType } from '@frontify/fondue/rte';

import { ELEMENT_BUTTON, type TButtonElement } from '..';
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
