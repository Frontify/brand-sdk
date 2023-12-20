/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type AsProps, type HTMLPropsAs, createComponentAs, createElementAs, useEditorRef } from '@udecode/plate';
import { useCallback } from 'react';

import { triggerFloatingButtonEdit } from '../../utils/triggerFloatingButtonEdit';

export const useFloatingButtonEditButton = (props: HTMLPropsAs<'button'>): HTMLPropsAs<'button'> => {
    const editor = useEditorRef();

    return {
        onClick: useCallback(() => {
            triggerFloatingButtonEdit(editor);
        }, [editor]),
        ...props,
    };
};

export const FloatingButtonEditButton = createComponentAs<AsProps<'button'>>((props) => {
    const htmlProps = useFloatingButtonEditButton(props);

    return createElementAs('button', htmlProps);
});
