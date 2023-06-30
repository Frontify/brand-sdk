/* (c) Copyright Frontify Ltd., all rights reserved. */

import {
    MultiInputLayout,
    SettingBlock,
    appendUnit,
    maximumNumericalOrPixelOrAutoRule,
    numericalOrPixelRule,
    presetCustomValue,
} from '../';
import { MARGIN_DEFAULT_PLACEHOLDER } from './defaultValues';
import { getMarginSlider } from './margin';
import { marginStyleMap } from './types';

type MarginSettingsType = {
    id?: string;
};

/**
 * Returns margin settings: margin switch, margin slider, custom margin input for every direction
 *
 * @param options Options for the settings
 * @param options.id Custom suffix for the setting ids
 * @returns {SettingBlock} Returns margin settings
 */
export const getMarginExtendedSettings = (options?: MarginSettingsType): SettingBlock => {
    const hasId = options?.id ? `hasExtendedCustomMargin_${options?.id}` : 'hasExtendedCustomMargin';
    const valueId = options?.id ? `extendedMarginValues_${options?.id}` : 'extendedMarginValues';
    const choiceId = options?.id ? `extendedMarginChoice_${options?.id}` : 'extendedMarginChoice';
    const topId = options?.id ? `extendedMarginTop_${options?.id}` : 'extendedMarginTop';
    const leftId = options?.id ? `extendedMarginLeft_${options?.id}` : 'extendedMarginLeft';
    const rightId = options?.id ? `extendedMarginRight_${options?.id}` : 'extendedMarginRight';
    const bottomId = options?.id ? `extendedMarginBottom_${options?.id}` : 'extendedMarginBottom';

    return {
        id: hasId,
        label: 'Margin',
        type: 'switch',
        switchLabel: 'Custom',
        defaultValue: false,
        info: 'The spacing around UI elements to create more negative space',
        onChange: (bundle) => {
            presetCustomValue(bundle, choiceId, topId, marginStyleMap);
            presetCustomValue(bundle, choiceId, leftId, marginStyleMap);
            presetCustomValue(bundle, choiceId, rightId, marginStyleMap);
            presetCustomValue(bundle, choiceId, bottomId, marginStyleMap);
        },
        on: [
            {
                id: valueId,
                type: 'multiInput',
                layout: MultiInputLayout.Spider,
                blocks: [
                    {
                        id: topId,
                        type: 'input',
                        label: 'Top',
                        placeholder: MARGIN_DEFAULT_PLACEHOLDER,
                        onChange: (bundle) => appendUnit(bundle, topId),
                        rules: [numericalOrPixelRule, maximumNumericalOrPixelOrAutoRule(500)],
                    },
                    {
                        id: leftId,
                        type: 'input',
                        label: 'Left',
                        placeholder: MARGIN_DEFAULT_PLACEHOLDER,
                        onChange: (bundle) => appendUnit(bundle, leftId),
                        rules: [numericalOrPixelRule, maximumNumericalOrPixelOrAutoRule(500)],
                    },
                    {
                        id: rightId,
                        type: 'input',
                        label: 'Right',
                        placeholder: MARGIN_DEFAULT_PLACEHOLDER,
                        onChange: (bundle) => appendUnit(bundle, rightId),
                        rules: [numericalOrPixelRule, maximumNumericalOrPixelOrAutoRule(500)],
                    },
                    {
                        id: bottomId,
                        type: 'input',
                        label: 'Bottom',
                        placeholder: MARGIN_DEFAULT_PLACEHOLDER,
                        onChange: (bundle) => appendUnit(bundle, bottomId),
                        rules: [numericalOrPixelRule, maximumNumericalOrPixelOrAutoRule(500)],
                    },
                ],
            },
        ],
        off: [getMarginSlider(choiceId)],
    };
};
