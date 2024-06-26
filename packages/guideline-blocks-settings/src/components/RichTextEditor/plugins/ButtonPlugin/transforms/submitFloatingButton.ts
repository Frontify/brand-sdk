/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type PlateEditor, type Value, focusEditor, getPluginOptions } from '@frontify/fondue';

import { floatingButtonActions, floatingButtonSelectors } from '../components/FloatingButton/floatingButtonStore';
import { type ButtonPlugin, ELEMENT_BUTTON } from '../createButtonPlugin';

import { upsertButton } from '.';

export const submitFloatingButton = <V extends Value>(editor: PlateEditor<V>) => {
    if (!editor.selection) {
        return;
    }

    const { isUrl, forceSubmit } = getPluginOptions<ButtonPlugin, V>(editor, ELEMENT_BUTTON);
    const url = floatingButtonSelectors.url();

    const isValid = isUrl?.(url) || forceSubmit;
    if (!isValid) {
        return;
    }

    const text = floatingButtonSelectors.text();
    const buttonStyle = floatingButtonSelectors.buttonStyle();
    const target = floatingButtonSelectors.newTab() ? undefined : '_self';

    floatingButtonActions.reset();

    upsertButton(editor, {
        url,
        text,
        buttonStyle,
        target,
        isUrl: (_url) => (forceSubmit || !isUrl ? true : isUrl(_url)),
    });

    setTimeout(() => {
        focusEditor(editor, editor.selection ?? undefined);
    }, 0);

    return true;
};
