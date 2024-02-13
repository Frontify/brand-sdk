/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useLinkToolbarButton, useLinkToolbarButtonState } from '@udecode/plate-link';
import { focusEditor } from '@udecode/slate-react';

import { ReactNode, forwardRef } from 'react';
import { IconLink16, IconStylingWrapper, ToolbarButton } from '@frontify/fondue';
import { useEditorRef } from '@udecode/plate-core';

export const LinkToolbarButton = forwardRef<HTMLButtonElement, { disabled: boolean; tooltip: ReactNode }>(
    (rootProps, ref) => {
        const editor = useEditorRef();
        const state = useLinkToolbarButtonState();
        const { props } = useLinkToolbarButton(state);
        return (
            <ToolbarButton
                onMouseDown={() => {
                    focusEditor(editor, editor.selection ?? editor.prevSelection ?? undefined);
                }}
                ref={ref}
                {...props}
                {...rootProps}
            >
                <IconStylingWrapper icon={<IconLink16 />} />
            </ToolbarButton>
        );
    },
);

LinkToolbarButton.displayName = 'LinkToolbarButton';
