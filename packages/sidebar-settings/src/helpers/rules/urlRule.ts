/* (c) Copyright Frontify Ltd., all rights reserved. */

import { Rule } from './Rule';

export const urlRule: Rule<string> = {
    errorMessage: 'Please use a valid url',
    validate: (value: string): boolean => {
        const regex = new RegExp(
            '^((http|https)://)[-a-zA-Z0-9@:%._+~#?&/=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%._+~#?&/=]*)$',
            'i',
        );

        return regex.test(value);
    },
};
