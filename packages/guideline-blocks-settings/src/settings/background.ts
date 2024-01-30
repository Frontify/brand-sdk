/* (c) Copyright Frontify Ltd., all rights reserved. */

import { Color } from '@frontify/fondue';
import { BACKGROUND_COLOR_DEFAULT_VALUE } from './defaultValues';
import { SettingBlock } from '../';

type BackgroundSettingsType = {
    id?: string;
    defaultValue?: boolean;
    defaultColor?: Color;
    preventDefaultColor?: boolean;
    switchLabel?: string;
    label?: string;
};

/**
 * Returns background settings: background switch, background color
 *
 * @param options Options for the settings
 * @param options.id Custom suffix for the setting ids
 * @param options.defaultValue Default value for the background switch
 * @param options.defaultColor Default value for the background color
 * @param options.preventDefaultColor Whether the background color should be empty by default
 * @param options.label Label for the background input
 * @param options.switchLabel Label for the background switch
 * @returns {SettingBlock} Returns background settings
 */

export const getBackgroundSettings = (options?: BackgroundSettingsType): SettingBlock => {
    const hasId = options?.id ? `hasBackground${options.id}` : 'hasBackground';
    const colorId = options?.id ? `backgroundColor${options.id}` : 'backgroundColor';
    const defaultColor = !!options?.preventDefaultColor
        ? undefined
        : options?.defaultColor || BACKGROUND_COLOR_DEFAULT_VALUE;
    const label = options?.label ? options.label : undefined;
    const switchLabel = options?.switchLabel ? options.switchLabel : undefined;

    return {
        id: hasId,
        label,
        type: 'switch',
        switchLabel,
        defaultValue: !!options?.defaultValue,
        on: [
            {
                id: colorId,
                defaultValue: defaultColor,
                type: 'colorInput',
            },
        ],
    };
};
