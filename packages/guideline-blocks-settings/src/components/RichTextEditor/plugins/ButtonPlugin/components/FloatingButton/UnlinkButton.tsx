/* (c) Copyright Frontify Ltd., all rights reserved. */

import {
    type AsProps,
    Button,
    type HTMLPropsAs,
    createComponentAs,
    createElementAs,
    focusEditor,
    useEditorRef,
} from '@udecode/plate';
import { useCallback } from 'react';

import { unwrapButton } from '../../transforms/index';

export const useUnlinkButton = (props: HTMLPropsAs<'button'>): HTMLPropsAs<'button'> => {
    const editor = useEditorRef();

    return {
        onClick: useCallback(() => {
            unwrapButton(editor);
            focusEditor(editor, editor.selection ?? undefined);
        }, [editor]),
        ...props,
    };
};

export const UnlinkButton = createComponentAs<AsProps<'button'>>((props) => {
    const htmlProps = useUnlinkButton(props);

    return createElementAs(Button, htmlProps);
});
