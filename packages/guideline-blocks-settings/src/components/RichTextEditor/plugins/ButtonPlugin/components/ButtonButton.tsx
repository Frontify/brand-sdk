/* (c) Copyright Frontify Ltd., all rights reserved. */

import { IconButton16, PluginButtonProps, buttonStyles } from '@frontify/fondue';
import { getPluginType } from '@udecode/plate';
import { ELEMENT_BUTTON } from '../createButtonPlugin';
import { ButtonToolbarButton } from './ButtonToolbarButton';

export const ButtonButton = ({ editor, id }: PluginButtonProps) => (
    <div data-plugin-id={id}>
        <ButtonToolbarButton
            type={getPluginType(editor, ELEMENT_BUTTON)}
            icon={
                <span className="tw-p-2 tw-h-8 tw-justify-center tw-items-center tw-flex">
                    <IconButton16 />
                </span>
            }
            styles={buttonStyles}
        />
    </div>
);
