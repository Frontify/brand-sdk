/* (c) Copyright Frontify Ltd., all rights reserved. */

import { Rule } from './Rule';
import { minimumNumericRule } from './minimumNumericRule';

/**
 * Rule to validate value is between two pixel values.
 *
 * @param {number} minimumValue Minimum value
 * @param {number} maximumValue Maximum value
 * @returns {Rule} Rule object with validator and error message.
 */
export const betweenPixelRule = (minimumValue: number, maximumValue: number): Rule<string> => ({
    errorMessage: `Please use a value between ${minimumValue} and ${maximumValue}.`,
    validate: (value: string): boolean =>
        minimumNumericRule(minimumValue).validate(value) && Number(value.replace(/px/, '')) <= maximumValue,
});
