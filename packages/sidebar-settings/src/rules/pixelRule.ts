/* (c) Copyright Frontify Ltd., all rights reserved. */

import { Rule } from './Rule';

export const pixelRule: Rule<string> = {
    errorMessage: "Please use a value with px'",
    validate: (value: string): boolean => value.match(/^-?\d+px$/g) !== null,
};
