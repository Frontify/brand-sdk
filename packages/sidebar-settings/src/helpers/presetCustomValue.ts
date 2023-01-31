/* (c) Copyright Frontify Ltd., all rights reserved. */

import { Bundle } from '../bundle';

/**
 * Sets value of custom input to predefined value from the slider, if no custom value is set already
 *
 * @param {Bundle} bundle Sidebar bundle object
 * @param {string} sliderId Setting id of the slider
 * @param {string} inputId Setting id of the input
 * @param {Object} map Map of enum and values
 * @returns Set value of custom input to predefined value from the slider
 */
export const presetCustomValue = <AppBridge = unknown>(
    bundle: Bundle<AppBridge>,
    sliderId: string,
    inputId: string,
    map: Record<string, string>
): void => {
    const sliderValue = bundle.getBlock(sliderId)?.value as string;
    const customValue = bundle.getBlock(inputId)?.value;
    const valueInMap = Object.keys(map).find((key) => map[key] === customValue);
    const isPrefinedValue = sliderValue && valueInMap;
    const hasNoCustomValue = sliderValue && !customValue;
    if (isPrefinedValue || hasNoCustomValue) {
        bundle.setBlockValue(inputId, map[sliderValue]);
    }
};
