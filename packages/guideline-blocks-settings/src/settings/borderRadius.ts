/* (c) Copyright Frontify Ltd., all rights reserved. */

import { SettingBlock, appendUnit, numericalOrPixelRule, presetCustomValue } from '../';

import { Radius, radiusStyleMap } from './types';

/**
 * Returns border radius settings: border radius switch, radius slider, custom radius input
 *
 * @param options Options for the settings
 * @param options.id Custom suffix for the setting ids
 * @param options.dependentSettingId Id of setting which the border radius is dependent on
 * @returns {SettingBlock} Returns border settings
 */

type BorderRadiusSettingsType = {
    id?: string;
    dependentSettingId?: string;
    radiusStyleMap?: Record<Radius, string>;
    defaultRadius?: Radius;
};

export const getBorderRadiusSlider = (id: string, defaultValue: Radius = Radius.None): SettingBlock => ({
    id,
    type: 'segmentedControls',
    defaultValue,
    choices: [
        {
            value: Radius.None,
            label: 'None',
        },
        {
            value: Radius.Small,
            label: 'S',
        },
        {
            value: Radius.Medium,
            label: 'M',
        },
        {
            value: Radius.Large,
            label: 'L',
        },
    ],
});

export const getBorderRadiusSettings = (options?: BorderRadiusSettingsType): SettingBlock => {
    const hasId = options?.id ? `hasRadius_${options.id}` : 'hasRadius';
    const valueId = options?.id ? `radiusValue_${options.id}` : 'radiusValue';
    const choiceId = options?.id ? `radiusChoice_${options.id}` : 'radiusChoice';
    const defaultValue = options?.defaultRadius || Radius.None;

    return {
        id: hasId,
        label: 'Corner radius',
        type: 'switch',
        switchLabel: 'Custom',
        defaultValue: false,
        info: 'Determining how rounded the corners are.',
        show: (bundle) => (options?.dependentSettingId ? !!bundle.getBlock(options.dependentSettingId)?.value : true),
        onChange: (bundle) => presetCustomValue(bundle, choiceId, valueId, options?.radiusStyleMap || radiusStyleMap),
        on: [
            {
                id: valueId,
                type: 'input',
                placeholder: 'e.g. 10px',
                rules: [numericalOrPixelRule],
                onChange: (bundle) => appendUnit(bundle, valueId),
            },
        ],
        off: [getBorderRadiusSlider(choiceId, defaultValue)],
    };
};
