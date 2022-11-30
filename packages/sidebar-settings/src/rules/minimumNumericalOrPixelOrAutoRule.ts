/* (c) Copyright Frontify Ltd., all rights reserved. */

import { numericalOrPixelRule } from './numericalOrPixelRule';
import { Rule } from './Rule';

export const minimumNumericalOrPixelOrAutoRule = (minimumValue: number): Rule<string> => ({
    errorMessage: `Please use a value bigger or equal to ${minimumValue}`,
    validate: (value: string): boolean =>
        value === 'auto' || (numericalOrPixelRule.validate(value) && Number(value.replace(/px/, '')) >= minimumValue),
});
