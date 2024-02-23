/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type Rule } from './Rule';
import { numericalOrPercentRule } from './numericalOrPercentRule';

export const maximumNumericalOrPercentRule = (maximumValue: number): Rule<string> => ({
    errorMessage: `Please use a value smaller than ${maximumValue}`,
    validate: (value: string): boolean =>
        numericalOrPercentRule.validate(value) && Number(value.replace(/%/, '')) <= maximumValue,
});
