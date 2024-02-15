/* (c) Copyright Frontify Ltd., all rights reserved. */

import {
    IconLink16,
    IconStylingWrapper,
    ToolbarButton,
    focusEditor,
    useEditorRef,
    useLinkToolbarButton,
    useLinkToolbarButtonState,
} from '@frontify/fondue';

import { ReactNode, forwardRef } from 'react';

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
