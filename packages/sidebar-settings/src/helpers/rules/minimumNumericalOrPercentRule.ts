/* (c) Copyright Frontify Ltd., all rights reserved. */

import { minimumNumericRule } from './minimumNumericRule';
import { numericalOrPercentRule } from './numericalOrPercentRule';
import { type Rule } from './Rule';

export const minimumNumericalOrPercentRule = (minimumValue: number): Rule<string> => ({
    errorMessage: `Please use a value bigger or than ${minimumValue}`,
    validate: (value: string): boolean =>
        numericalOrPercentRule.validate(value) && minimumNumericRule(minimumValue).validate(value),
});
