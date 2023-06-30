/* (c) Copyright Frontify Ltd., all rights reserved. */

import { MultiInputLayout, SettingBlock, appendUnit, numericalOrPixelRule, presetCustomValue } from '../';
import { getBorderRadiusSlider } from './borderRadius';
import { Radius, radiusStyleMap } from './types';

/**
 * Returns border radius settings: border radius switch, radius slider, custom radius inputs for every corner
 *
 * @param options Options for the settings
 * @param options.id Custom suffix for the setting ids
 * @param options.dependentSettingId Id of setting which the border radius is dependent on
 * @returns {SettingBlock} Returns border settings
 */

type BorderRadiusSettingsType = {
    id?: string;
    dependentSettingId?: string;
    defaultValue?: Radius;
};

export const getExtendedBorderRadiusSettings = (options?: BorderRadiusSettingsType): SettingBlock => {
    const hasId = options?.id ? `hasExtendedCustomRadius_${options.id}` : 'hasExtendedCustomRadius';
    const valueId = options?.id ? `extendedRadiusValue_${options.id}` : 'extendedRadiusValue';
    const choiceId = options?.id ? `extendedRadiusChoice_${options.id}` : 'extendedRadiusChoice';
    const topLeftId = options?.id ? `extendedRadiusTopLeft_${options.id}` : 'extendedRadiusTopLeft';
    const topRightId = options?.id ? `extendedRadiusTopRight_${options.id}` : 'extendedRadiusTopRight';
    const bottomLeftId = options?.id ? `extendedRadiusBottomLeft_${options.id}` : 'extendedRadiusBottomLeft';
    const bottomRightId = options?.id ? `extendedRadiusBottomRight_${options.id}` : 'extendedRadiusBottomRight';

    return {
        id: hasId,
        label: 'Corner radius',
        type: 'switch',
        switchLabel: 'Custom',
        defaultValue: false,
        info: 'Determining how rounded the corners are.',
        show: (bundle) => (options?.dependentSettingId ? !!bundle.getBlock(options.dependentSettingId)?.value : true),
        onChange: (bundle) => {
            presetCustomValue(bundle, choiceId, topLeftId, radiusStyleMap);
            presetCustomValue(bundle, choiceId, topRightId, radiusStyleMap);
            presetCustomValue(bundle, choiceId, bottomLeftId, radiusStyleMap);
            presetCustomValue(bundle, choiceId, bottomRightId, radiusStyleMap);
        },
        on: [
            {
                id: valueId,
                type: 'multiInput',
                layout: MultiInputLayout.Columns,
                blocks: [
                    {
                        id: topLeftId,
                        type: 'input',
                        label: 'Top Left',
                        rules: [numericalOrPixelRule],
                        onChange: (bundle) => appendUnit(bundle, topLeftId),
                    },
                    {
                        id: topRightId,
                        type: 'input',
                        label: 'Top Right',
                        rules: [numericalOrPixelRule],
                        onChange: (bundle) => appendUnit(bundle, topRightId),
                    },
                    {
                        id: bottomLeftId,
                        type: 'input',
                        label: 'Bottom Left',
                        rules: [numericalOrPixelRule],
                        onChange: (bundle) => appendUnit(bundle, bottomLeftId),
                    },
                    {
                        id: bottomRightId,
                        type: 'input',
                        label: 'Bottom Right',
                        rules: [numericalOrPixelRule],
                        onChange: (bundle) => appendUnit(bundle, bottomRightId),
                    },
                ],
            },
        ],
        off: [getBorderRadiusSlider(choiceId, options?.defaultValue)],
    };
};
