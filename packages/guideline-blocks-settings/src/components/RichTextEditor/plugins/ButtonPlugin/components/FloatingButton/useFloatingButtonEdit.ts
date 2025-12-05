/* (c) Copyright Frontify Ltd., all rights reserved. */

import {
    type UseVirtualFloatingOptions,
    getAboveNode,
    getDefaultBoundingClientRect,
    getEndPoint,
    getPluginOptions,
    getPluginType,
    getRangeBoundingClientRect,
    getStartPoint,
    someNode,
    useComposedRef,
    useEditorRef,
    useEditorVersion,
    useHotkeys,
} from '@frontify/fondue/rte';
import { type Ref, useCallback, useEffect } from 'react';

import { type ButtonPlugin, ELEMENT_BUTTON } from '../../createButtonPlugin';
import { getUrlFromEditor } from '../../utils';
import { triggerFloatingButtonEdit } from '../../utils/triggerFloatingButtonEdit';

import {
    floatingButtonActions,
    floatingButtonSelectors,
    useFloatingButtonEnter,
    useFloatingButtonEscape,
    useFloatingButtonSelectors,
    useVirtualFloatingButton,
} from '.';

export const useFloatingButtonEdit = (
    floatingOptions: UseVirtualFloatingOptions,
): React.HTMLAttributes<HTMLDivElement> & { ref: Ref<HTMLDivElement> } => {
    const editor = useEditorRef();
    const mode = useFloatingButtonSelectors().mode();
    const open = useFloatingButtonSelectors().isOpen(editor.id);
    const version = useEditorVersion();

    const { triggerFloatingButtonHotkeys } = getPluginOptions<ButtonPlugin>(editor, ELEMENT_BUTTON);

    const getBoundingClientRect = useCallback(() => {
        const entry = getAboveNode(editor, {
            match: { type: getPluginType(editor, ELEMENT_BUTTON) },
        });

        if (entry) {
            const [, path] = entry;
            return getRangeBoundingClientRect(editor, {
                anchor: getStartPoint(editor, path),
                focus: getEndPoint(editor, path),
            });
        }

        return getDefaultBoundingClientRect();
    }, [editor]);

    const isOpen = open && mode === 'edit';

    const { update, style, floating } = useVirtualFloatingButton({
        open: isOpen,
        getBoundingClientRect,
        ...floatingOptions,
    });

    useEffect(() => {
        const url = getUrlFromEditor(editor);
        if (url) {
            floatingButtonActions.url(url);
        }

        if (
            editor.selection &&
            someNode(editor, {
                match: { type: getPluginType(editor, ELEMENT_BUTTON) },
            })
        ) {
            floatingButtonActions.show('edit', editor.id);
            update();
            return;
        }

        if (floatingButtonSelectors.mode() === 'edit') {
            floatingButtonActions.reset();
        }
    }, [editor, version, update]);

    useHotkeys(
        triggerFloatingButtonHotkeys,
        (e) => {
            e.preventDefault();

            if (floatingButtonSelectors.mode() === 'edit') {
                triggerFloatingButtonEdit(editor);
            }
        },
        {
            enableOnContentEditable: true,
        },
        [],
    );

    useFloatingButtonEnter();

    useFloatingButtonEscape();

    return {
        style,
        ref: useComposedRef<HTMLElement | null>(floating),
    };
};
