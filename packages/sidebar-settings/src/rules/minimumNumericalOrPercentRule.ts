/* (c) Copyright Frontify Ltd., all rights reserved. */

import { Rule } from './Rule';
import { numericalOrPercentRule } from './numericalOrPercentRule';
import { minimumNumericRule } from './minimumNumericRule';

export const minimumNumericalOrPercentRule = (minimumValue: number): Rule<string> => ({
    errorMessage: `Please use a value bigger or than ${minimumValue}`,
    validate: (value: string): boolean =>
        numericalOrPercentRule.validate(value) && minimumNumericRule(minimumValue).validate(value),
});
