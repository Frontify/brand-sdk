/* (c) Copyright Frontify Ltd., all rights reserved. */

import {
    Color,
    MultiInputLayout,
    SettingBlock,
    appendUnit,
    maximumNumericalOrPixelOrAutoRule,
    numericalOrPixelRule,
} from '../';
import { BORDER_COLOR_DEFAULT_VALUE, BORDER_WIDTH_DEFAULT_VALUE } from './defaultValues';
import { BorderStyle } from './types';

/**
 * Returns border settings: border switch, border style, border width, border color
 *
 * @param options Options for the settings
 * @param options.id Custom suffix for the setting ids
 * @param options.switchLabel Label for the border switch
 * @param options.defaultValue Default value for the border switch
 * @returns {SettingBlock} Returns border settings
 */

type BorderSettingsType = {
    id?: string;
    defaultValue?: boolean;
    defaultColor?: Color;
    switchLabel?: string;
};

export const getBorderSettings = (options?: BorderSettingsType): SettingBlock => {
    const hasId = options?.id ? `hasBorder_${options.id}` : 'hasBorder';
    const selectionId = options?.id ? `borderSelection_${options.id}` : 'borderSelection';
    const styleId = options?.id ? `borderStyle_${options.id}` : 'borderStyle';
    const widthId = options?.id ? `borderWidth_${options.id}` : 'borderWidth';
    const colorId = options?.id ? `borderColor_${options.id}` : 'borderColor';
    const defaultColor = options?.defaultColor || BORDER_COLOR_DEFAULT_VALUE;
    const switchLabel = options?.switchLabel ? options.switchLabel : undefined;

    return {
        id: hasId,
        label: 'Border',
        type: 'switch',
        switchLabel,
        defaultValue: !!options?.defaultValue,
        on: [
            {
                id: selectionId,
                type: 'multiInput',
                onChange: (bundle) => appendUnit(bundle, widthId),
                layout: MultiInputLayout.Columns,
                lastItemFullWidth: true,
                blocks: [
                    {
                        id: styleId,
                        type: 'dropdown',
                        defaultValue: BorderStyle.Solid,
                        choices: [
                            {
                                value: BorderStyle.Solid,
                                label: BorderStyle.Solid,
                            },
                            {
                                value: BorderStyle.Dotted,
                                label: BorderStyle.Dotted,
                            },
                            {
                                value: BorderStyle.Dashed,
                                label: BorderStyle.Dashed,
                            },
                        ],
                    },
                    {
                        id: widthId,
                        type: 'input',
                        defaultValue: BORDER_WIDTH_DEFAULT_VALUE,
                        rules: [numericalOrPixelRule, maximumNumericalOrPixelOrAutoRule(500)],
                        placeholder: 'e.g. 3px',
                    },
                    {
                        id: colorId,
                        type: 'colorInput',
                        defaultValue: defaultColor,
                    },
                ],
            },
        ],
        off: [],
    };
};
