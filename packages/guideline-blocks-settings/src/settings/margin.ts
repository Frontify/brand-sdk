/* (c) Copyright Frontify Ltd., all rights reserved. */

import {
    SettingBlock,
    appendUnit,
    maximumNumericalOrPixelOrAutoRule,
    numericalOrPixelRule,
    presetCustomValue,
} from '../';
import { MARGIN_DEFAULT_PLACEHOLDER } from './defaultValues';
import { Margin, marginStyleMap } from './types';

type MarginSettingsType = {
    id?: string;
    marginStyleMap?: Record<Margin, string>;
};

/**
 * Returns margin settings: margin switch, margin slider, custom margin input
 *
 * @param {string} id Custom suffix for the setting ids
 * @returns {SettingBlock} Returns margin settings
 */
export const getMarginSlider = (id: string): SettingBlock => ({
    id,
    type: 'segmentedControls',
    defaultValue: Margin.None,
    choices: [
        {
            value: Margin.None,
            label: 'None',
        },
        {
            value: Margin.Small,
            label: 'S',
        },
        {
            value: Margin.Medium,
            label: 'M',
        },
        {
            value: Margin.Large,
            label: 'L',
        },
    ],
});

export const getMarginSettings = (options?: MarginSettingsType): SettingBlock => {
    const hasId = options?.id ? `hasCustomMarginValue_${options?.id}` : 'hasCustomMarginValue';
    const valueId = options?.id ? `marginValue_${options?.id}` : 'marginValue';
    const choiceId = options?.id ? `marginChoice_${options?.id}` : 'marginChoice';

    return {
        id: hasId,
        label: 'Margin',
        type: 'switch',
        switchLabel: 'Custom',
        defaultValue: false,
        info: 'The spacing around UI elements to create more space',
        onChange: (bundle) => presetCustomValue(bundle, choiceId, valueId, options?.marginStyleMap || marginStyleMap),
        on: [
            {
                id: valueId,
                type: 'input',
                placeholder: MARGIN_DEFAULT_PLACEHOLDER,
                rules: [numericalOrPixelRule, maximumNumericalOrPixelOrAutoRule(500)],
                onChange: (bundle) => appendUnit(bundle, valueId),
            },
        ],
        off: [getMarginSlider(choiceId)],
    };
};
