/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type Rule } from './Rule';
import { numericalOrPixelRule } from './numericalOrPixelRule';

export const minimumNumericalOrPixelOrAutoRule = (minimumValue: number): Rule<string> => ({
    errorMessage: `Please use a value bigger or equal to ${minimumValue}`,
    validate: (value: string): boolean =>
        value === 'auto' || (numericalOrPixelRule.validate(value) && Number(value.replace(/px/, '')) >= minimumValue),
});
