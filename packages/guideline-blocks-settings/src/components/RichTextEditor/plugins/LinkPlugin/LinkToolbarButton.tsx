/* (c) Copyright Frontify Ltd., all rights reserved. */

import { IconLink } from '@frontify/fondue/icons';
import {
    IconStylingWrapper,
    ToolbarButton,
    focusEditor,
    useEditorRef,
    useLinkToolbarButton,
    useLinkToolbarButtonState,
} from '@frontify/fondue/rte';
import { type ReactNode, forwardRef } from 'react';

export const LinkToolbarButton = forwardRef<HTMLButtonElement, { disabled: boolean; tooltip: ReactNode }>(
    (rootProps, ref) => {
        const editor = useEditorRef();
        const state = useLinkToolbarButtonState();
        const { props } = useLinkToolbarButton(state);
        return (
            <ToolbarButton
                onMouseDown={(event) => {
                    event.preventDefault();
                    focusEditor(editor, editor.selection ?? editor.prevSelection ?? undefined);
                }}
                ref={ref}
                {...props}
                {...rootProps}
            >
                <IconStylingWrapper icon={<IconLink size={16} />} />
            </ToolbarButton>
        );
    },
);

LinkToolbarButton.displayName = 'LinkToolbarButton';
