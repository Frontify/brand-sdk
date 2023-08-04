/* (c) Copyright Frontify Ltd., all rights reserved. */

import { Bundle } from '../bundle';

/**
 * Sets value of custom input to predefined value from the Segmented Controls, if no custom value is set already
 *
 * @param {Bundle} bundle Sidebar bundle object
 * @param {string} segmentedControlsId Setting id of the segmentedControls
 * @param {string} inputId Setting id of the input
 * @param {Object} map Map of enum and values
 * @returns Set value of custom input to predefined value from the segmentedControls
 */
export const presetCustomValue = <AppBridge = unknown>(
    bundle: Bundle<AppBridge>,
    segmentedControlsId: string,
    inputId: string,
    map: Record<string, string>,
): void => {
    const segmentedControlsValue = bundle.getBlock(segmentedControlsId)?.value as string;
    const customValue = bundle.getBlock(inputId)?.value;
    const valueInMap = Object.keys(map).find((key) => map[key] === customValue);
    const isPrefinedValue = segmentedControlsValue && valueInMap;
    const hasNoCustomValue = segmentedControlsValue && !customValue;
    if (isPrefinedValue || hasNoCustomValue) {
        bundle.setBlockValue(inputId, map[segmentedControlsValue]);
    }
};
