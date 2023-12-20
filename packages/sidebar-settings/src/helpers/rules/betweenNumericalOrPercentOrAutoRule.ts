/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type Rule } from './Rule';
import { maximumNumericalOrPercentOrAutoRule } from './maximumNumericalOrPercentOrAutoRule';
import { minimumNumericalOrPercentOrAutoRule } from './minimumNumericalOrPercentOrAutoRule';

/**
 * Rule to validate value is between two pixel values.
 *
 * @param {number} minimumValue Minimum value
 * @param {number} maximumValue Maximum value
 * @returns {Rule} Rule object with validator and error message.
 */
export const betweenNumericalOrPercentOrAutoRule = (minimumValue: number, maximumValue: number): Rule<string> => ({
    errorMessage: `Please use a value between ${minimumValue} and ${maximumValue} or 'auto'.`,
    validate: (value: string): boolean =>
        minimumNumericalOrPercentOrAutoRule(minimumValue).validate(value) &&
        maximumNumericalOrPercentOrAutoRule(maximumValue).validate(value),
});
