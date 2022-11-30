/* (c) Copyright Frontify Ltd., all rights reserved. */

import { numericalOrPercentRule } from './numericalOrPercentRule';
import { Rule } from './Rule';

export const maximumNumericalOrPercentOrAutoRule = (maximumValue: number): Rule<string> => ({
    errorMessage: `Please use a value smaller than ${maximumValue}`,
    validate: (value: string): boolean =>
        value === 'auto' || (numericalOrPercentRule.validate(value) && Number(value.replace(/%/, '')) <= maximumValue),
});
