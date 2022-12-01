/* (c) Copyright Frontify Ltd., all rights reserved. */

import { Rule } from './Rule';
import { numericalOrPercentRule } from './numericalOrPercentRule';
import { minimumNumericRule } from './minimumNumericRule';

export const minimumNumericalOrPercentOrAutoRule = (minimumValue: number): Rule<string> => ({
    errorMessage: `Please use a value bigger or equal to ${minimumValue}`,
    validate: (value: string): boolean =>
        value === 'auto' ||
        (numericalOrPercentRule.validate(value) && minimumNumericRule(minimumValue).validate(value)),
});
