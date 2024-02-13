/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useEditorState, useEventPlateId } from '@udecode/plate-core';
import { isRangeInSameBlock } from '@udecode/slate-utils';
import { LinkToolbarButton } from './LinkToolbarButton';
import { PluginButtonProps, getHotkeyByPlatform, getTooltip } from '@frontify/fondue';

export const LinkButton = ({ id, editorId }: PluginButtonProps) => {
    const editor = useEditorState(useEventPlateId(editorId));
    const isEnabled = !!isRangeInSameBlock(editor, {
        at: editor.selection,
    });

    return (
        <div data-plugin-id={id}>
            <LinkToolbarButton
                disabled={!isEnabled}
                tooltip={getTooltip(
                    isEnabled
                        ? `Link\n${getHotkeyByPlatform('Ctrl+K')}`
                        : 'Links can only be set for a single text block.',
                )}
            />
        </div>
    );
};
