/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type Rule } from './Rule';
import { minimumNumericRule } from './minimumNumericRule';
import { numericalOrPercentRule } from './numericalOrPercentRule';

export const minimumNumericalOrPercentRule = (minimumValue: number): Rule<string> => ({
    errorMessage: `Please use a value bigger or than ${minimumValue}`,
    validate: (value: string): boolean =>
        numericalOrPercentRule.validate(value) && minimumNumericRule(minimumValue).validate(value),
});
