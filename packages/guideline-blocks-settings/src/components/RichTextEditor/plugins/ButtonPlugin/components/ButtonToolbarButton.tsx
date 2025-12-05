/* (c) Copyright Frontify Ltd., all rights reserved. */

import { IconButton } from '@frontify/fondue/icons';
import { IconStylingWrapper, ToolbarButton, focusEditor, useEditorRef } from '@frontify/fondue/rte';
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
            onMouseDown={(event) => {
                event.preventDefault();
                focusEditor(editor, editor.selection ?? editor.prevSelection ?? undefined);
            }}
            onClick={() => {
                triggerFloatingButton(editor, { focused: true });
            }}
        >
            <IconStylingWrapper icon={<IconButton size={16} />} />
        </ToolbarButton>
    );
});

ButtonToolbarButton.displayName = 'ButtonToolbarButton';
