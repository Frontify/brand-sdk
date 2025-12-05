/* (c) Copyright Frontify Ltd., all rights reserved. */

import {
    type PluginButtonProps,
    getHotkeyByPlatform,
    getPluginType,
    getTooltip,
    isRangeInSameBlock,
    someNode,
    useEditorState,
    useEventPlateId,
} from '@frontify/fondue/rte';

import { ELEMENT_BUTTON } from '../createButtonPlugin';

import { ButtonToolbarButton } from './ButtonToolbarButton';

export const ButtonButton = ({ editorId, id }: PluginButtonProps) => {
    const editor = useEditorState(useEventPlateId(editorId));
    const isEnabled = !!isRangeInSameBlock(editor, {
        at: editor.selection,
    });
    const type = getPluginType(editor, ELEMENT_BUTTON);
    const isLink = !!editor?.selection && someNode(editor, { match: { type } });

    return (
        <div data-plugin-id={id}>
            <ButtonToolbarButton
                pressed={isLink}
                disabled={!isEnabled} // maybe pressed
                tooltip={getTooltip(
                    isEnabled
                        ? `Button\n${getHotkeyByPlatform('Ctrl+Shift+K')}`
                        : 'Buttons can only be set for a single text block.',
                )}
            />
        </div>
    );
};
