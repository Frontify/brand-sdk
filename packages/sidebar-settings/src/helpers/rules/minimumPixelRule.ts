/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type Rule } from './Rule';
import { minimumNumericRule } from './minimumNumericRule';
import { pixelRule } from './pixelRule';

export const minimumPixelRule = (minimumValue: number): Rule<string> => ({
    errorMessage: `Please use a value bigger or equal ${minimumValue} with 'px'`,
    validate: (value: string): boolean => {
        return pixelRule.validate(value) && minimumNumericRule(minimumValue).validate(value);
    },
});
