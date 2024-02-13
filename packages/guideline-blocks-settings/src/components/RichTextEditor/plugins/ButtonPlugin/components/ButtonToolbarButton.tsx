/* (c) Copyright Frontify Ltd., all rights reserved. */

import { IconButton16 } from '@frontify/fondue';
import { useEditorRef } from '@udecode/plate-core';
import { focusEditor } from '@udecode/slate-react';

import { triggerFloatingButton } from '../utils';

import { ReactNode, forwardRef } from 'react';
import { IconStylingWrapper, ToolbarButton } from '@frontify/fondue';

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
