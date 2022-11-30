/* (c) Copyright Frontify Ltd., all rights reserved. */

import { Rule } from './Rule';
import { pixelRule } from './pixelRule';
import { minimumNumericRule } from './minimumNumericRule';

export const minimumPixelRule = (minimumValue: number): Rule<string> => ({
    errorMessage: `Please use a value bigger or equal ${minimumValue} with 'px'`,
    validate: (value: string): boolean => {
        return pixelRule.validate(value) && minimumNumericRule(minimumValue).validate(value);
    },
});
