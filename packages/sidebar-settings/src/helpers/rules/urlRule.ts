/* (c) Copyright Frontify Ltd., all rights reserved. */

import { Rule } from './Rule';

export const urlRule: Rule<string> = {
    errorMessage: 'Please use a valid url',
    validate: (value: string): boolean => {
        try {
            new URL(value);
            return true;
        } catch {
            return false;
        }
    },
};
