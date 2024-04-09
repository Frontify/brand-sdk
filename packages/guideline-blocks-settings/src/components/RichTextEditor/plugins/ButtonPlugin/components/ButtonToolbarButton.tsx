/* (c) Copyright Frontify Ltd., all rights reserved. */

import { IconButton16, IconStylingWrapper, ToolbarButton, focusEditor, useEditorRef } from '@frontify/fondue';
import { type ReactNode, forwardRef } from 'react';

import { triggerFloatingButton } from '../utils';

export const ButtonToolbarButton = forwardRef<
    HTMLButtonElement,
    { disabled: boolean; tooltip: ReactNode; pressed: boolean }
>((rootProps, ref) => {
    const editor = useEditorRef();

    return (
        <ToolbarButton
            ref={ref}
            {...rootProps}
            onMouseDown={() => {
                focusEditor(editor, editor.selection ?? editor.prevSelection ?? undefined);
            }}
            onClick={() => {
                triggerFloatingButton(editor, { focused: true });
            }}
        >
            <IconStylingWrapper icon={<IconButton16 />} />
        </ToolbarButton>
    );
});

ButtonToolbarButton.displayName = 'ButtonToolbarButton';
