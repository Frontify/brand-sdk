/* (c) Copyright Frontify Ltd., all rights reserved. */

import {
    MultiInputLayout,
    SettingBlock,
    appendUnit,
    maximumNumericalOrPixelOrAutoRule,
    numericalOrPixelRule,
    presetCustomValue,
} from '../';
import { PADDING_DEFAULT_PLACEHOLDER } from './defaultValues';
import { getPaddingSlider } from './padding';
import { paddingStyleMap } from './types';

type PaddingSettingsType = {
    id?: string;
};

/**
 * Returns padding settings: padding switch, padding slider, custom padding input for every direction
 *
 * @param options Options for the settings
 * @param options.id Custom suffix for the setting ids
 * @returns {SettingBlock} Returns padding settings
 */
export const getPaddingExtendedSettings = (options?: PaddingSettingsType): SettingBlock => {
    const hasId = options?.id ? `hasExtendedCustomPadding_${options?.id}` : 'hasExtendedCustomPadding';
    const valueId = options?.id ? `extendedPaddingValues_${options?.id}` : 'extendedPaddingValues';
    const choiceId = options?.id ? `extendedPaddingChoice_${options?.id}` : 'extendedPaddingChoice';
    const topId = options?.id ? `extendedPaddingTop_${options?.id}` : 'extendedPaddingTop';
    const leftId = options?.id ? `extendedPaddingLeft_${options?.id}` : 'extendedPaddingLeft';
    const rightId = options?.id ? `extendedPaddingRight_${options?.id}` : 'extendedPaddingRight';
    const bottomId = options?.id ? `extendedPaddingBottom_${options?.id}` : 'extendedPaddingBottom';

    return {
        id: hasId,
        label: 'Padding',
        type: 'switch',
        switchLabel: 'Custom',
        defaultValue: false,
        info: 'The spacing around UI elements to create more negative space',
        onChange: (bundle) => {
            presetCustomValue(bundle, choiceId, topId, paddingStyleMap);
            presetCustomValue(bundle, choiceId, leftId, paddingStyleMap);
            presetCustomValue(bundle, choiceId, rightId, paddingStyleMap);
            presetCustomValue(bundle, choiceId, bottomId, paddingStyleMap);
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
                        placeholder: PADDING_DEFAULT_PLACEHOLDER,
                        onChange: (bundle) => appendUnit(bundle, topId),
                        rules: [numericalOrPixelRule, maximumNumericalOrPixelOrAutoRule(500)],
                    },
                    {
                        id: leftId,
                        type: 'input',
                        label: 'Left',
                        placeholder: PADDING_DEFAULT_PLACEHOLDER,
                        onChange: (bundle) => appendUnit(bundle, leftId),
                        rules: [numericalOrPixelRule, maximumNumericalOrPixelOrAutoRule(500)],
                    },
                    {
                        id: rightId,
                        type: 'input',
                        label: 'Right',
                        placeholder: PADDING_DEFAULT_PLACEHOLDER,
                        onChange: (bundle) => appendUnit(bundle, rightId),
                        rules: [numericalOrPixelRule, maximumNumericalOrPixelOrAutoRule(500)],
                    },
                    {
                        id: bottomId,
                        type: 'input',
                        label: 'Bottom',
                        placeholder: PADDING_DEFAULT_PLACEHOLDER,
                        onChange: (bundle) => appendUnit(bundle, bottomId),
                        rules: [numericalOrPixelRule, maximumNumericalOrPixelOrAutoRule(500)],
                    },
                ],
            },
        ],
        off: [getPaddingSlider(choiceId)],
    };
};
