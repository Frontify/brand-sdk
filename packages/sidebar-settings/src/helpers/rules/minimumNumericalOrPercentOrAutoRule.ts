/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type Rule } from './Rule';
import { minimumNumericRule } from './minimumNumericRule';
import { numericalOrPercentRule } from './numericalOrPercentRule';

export const minimumNumericalOrPercentOrAutoRule = (minimumValue: number): Rule<string> => ({
    errorMessage: `Please use a value bigger or equal to ${minimumValue}`,
    validate: (value: string): boolean =>
        value === 'auto' ||
        (numericalOrPercentRule.validate(value) && minimumNumericRule(minimumValue).validate(value)),
});
