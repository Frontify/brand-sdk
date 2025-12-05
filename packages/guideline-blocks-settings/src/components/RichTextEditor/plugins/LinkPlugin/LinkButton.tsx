/* (c) Copyright Frontify Ltd., all rights reserved. */

import {
    type PluginButtonProps,
    getHotkeyByPlatform,
    getTooltip,
    isRangeInSameBlock,
    useEditorState,
    useEventPlateId,
} from '@frontify/fondue/rte';

import { LinkToolbarButton } from './LinkToolbarButton';

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
