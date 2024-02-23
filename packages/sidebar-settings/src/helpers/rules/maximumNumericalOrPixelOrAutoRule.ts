/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type Rule } from './Rule';
import { numericalOrPixelRule } from './numericalOrPixelRule';

export const maximumNumericalOrPixelOrAutoRule = (maximumValue: number): Rule<string> => ({
    errorMessage: `Please use a value smaller than ${maximumValue}`,
    validate: (value: string): boolean =>
        value === 'auto' || (numericalOrPixelRule.validate(value) && Number(value.replace(/px/, '')) <= maximumValue),
});
