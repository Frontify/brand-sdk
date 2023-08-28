/* (c) Copyright Frontify Ltd., all rights reserved. */

import {
    IconLink,
    IconSize,
    PluginButtonProps,
    getButtonClassNames,
    getHotkeyByPlatform,
    getTooltip,
} from '@frontify/fondue';
import { LinkToolbarButton, isRangeInSameBlock, useEventPlateId, usePlateEditorState } from '@udecode/plate';

export const LinkButton = ({ id, editorId }: PluginButtonProps) => {
    const editor = usePlateEditorState(useEventPlateId(editorId));
    const isEnabled = !!isRangeInSameBlock(editor, {
        at: editor.selection,
    });

    return (
        <div data-plugin-id={id}>
            <LinkToolbarButton
                tooltip={getTooltip(
                    isEnabled
                        ? `Link\n${getHotkeyByPlatform('Ctrl+K')}`
                        : 'Links can only be set for a single text block.',
                )}
                icon={
                    <span className="tw-p-2 tw-h-8 tw-justify-center tw-items-center tw-flex">
                        <IconLink size={IconSize.Size16} />
                    </span>
                }
                classNames={getButtonClassNames(isEnabled)}
                styles={{ root: { width: '24px', height: '24px' } }}
                actionHandler="onMouseDown"
            />
        </div>
    );
};
