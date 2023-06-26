/* (c) Copyright Frontify Ltd., all rights reserved. */

import { SettingBlock, appendUnit, numericalOrPixelRule, presetCustomValue } from '../';
import { GutterSpacing, gutterSpacingStyleMap } from './types';

/**
 * Returns gutter settings: gutter switch, gutter choices or gutter custom input
 *
 * @param options Options for the settings
 * @param options.id Custom id for the gutters switch
 * @param options.dependentSettingId Id of the dependent setting
 * @param options.spacingChoiceId Id of the spacing choice
 * @param options.defaultValueChoices Default value for the spacing choice
 * @returns {SettingBlock} Returns the gutter settings
 */

type GutterSettingsType = {
    id?: string;
    dependentSettingId?: string;
    spacingChoiceId?: string;
    spacingCustomId?: string;
    defaultValueChoices?: GutterSpacing;
};

export const getGutterSettings = (options?: GutterSettingsType): SettingBlock => {
    const id = options?.id ? options.id : 'hasCustomSpacing';
    const dependentSettingId = options?.dependentSettingId ? options.dependentSettingId : 'columns';
    const spacingChoiceId = options?.spacingChoiceId ? options.spacingChoiceId : 'spacingChoice';
    const spacingCustomId = options?.spacingCustomId ? options.spacingCustomId : 'spacingCustom';
    const defaultValueChoices = options?.defaultValueChoices ? options.defaultValueChoices : GutterSpacing.M;

    return {
        id,
        type: 'switch',
        defaultValue: false,
        switchLabel: 'Custom',
        label: 'Gutter',
        info: 'An official nerds term for ‘gap’',
        onChange: (bundle) => presetCustomValue(bundle, spacingChoiceId, spacingCustomId, gutterSpacingStyleMap),
        show: (bundle) => bundle.getBlock(dependentSettingId)?.value !== '1',
        on: [
            {
                id: spacingCustomId,
                type: 'input',
                rules: [numericalOrPixelRule],
                onChange: (bundle) => appendUnit(bundle, spacingCustomId),
            },
        ],
        off: [
            {
                id: spacingChoiceId,
                type: 'slider',
                defaultValue: defaultValueChoices,
                choices: [
                    {
                        value: GutterSpacing.Auto,
                        label: 'Auto',
                    },
                    {
                        value: GutterSpacing.S,
                        label: 'S',
                    },
                    {
                        value: GutterSpacing.M,
                        label: 'M',
                    },
                    {
                        value: GutterSpacing.L,
                        label: 'L',
                    },
                ],
            },
        ],
    };
};
