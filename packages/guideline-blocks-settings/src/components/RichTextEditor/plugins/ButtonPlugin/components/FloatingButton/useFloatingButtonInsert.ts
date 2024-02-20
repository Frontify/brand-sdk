/* (c) Copyright Frontify Ltd., all rights reserved. */

import {
    UseVirtualFloatingOptions,
    getPluginOptions,
    getSelectionBoundingClientRect,
    useComposedRef,
    useEditorRef,
    useFocused,
    useHotkeys,
} from '@frontify/fondue';
import { useEffect } from 'react';
import { ButtonPlugin, ELEMENT_BUTTON } from '../../createButtonPlugin';
import { triggerFloatingButtonInsert } from '../../utils/triggerFloatingButtonInsert';
import {
    floatingButtonActions,
    useFloatingButtonEscape,
    useFloatingButtonSelectors,
    useVirtualFloatingButton,
} from '.';

export const useFloatingButtonInsert = ({ floatingOptions, ...props }: UseVirtualFloatingOptions) => {
    const editor = useEditorRef();
    const focused = useFocused();
    const mode = useFloatingButtonSelectors().mode();
    const open = useFloatingButtonSelectors().isOpen(editor.id);

    const { triggerFloatingButtonHotkeys } = getPluginOptions<ButtonPlugin>(editor, ELEMENT_BUTTON);

    useHotkeys(
        triggerFloatingButtonHotkeys,
        (e) => {
            e.preventDefault();

            triggerFloatingButtonInsert(editor, {
                focused,
            });
        },
        {
            enableOnContentEditable: true,
        },
        [focused],
    );

    const { update, style, floating } = useVirtualFloatingButton({
        open: open && mode === 'insert',
        getBoundingClientRect: getSelectionBoundingClientRect,
        whileElementsMounted: undefined,
        ...floatingOptions,
    });

    // wait for update before focusing input
    useEffect(() => {
        if (open) {
            update();
        }
        floatingButtonActions.updated(open);
    }, [open, update]);

    useFloatingButtonEscape();

    return {
        style: {
            ...style,
            zIndex: 1000,
        },
        ...props,
        ref: useComposedRef<HTMLElement | null>(props.ref, floating),
    };
};
