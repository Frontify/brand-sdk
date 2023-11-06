/* (c) Copyright Frontify Ltd., all rights reserved. */

import { urlRule } from '../../../src/helpers/rules/urlRule';
import { describe, expect, test } from 'vitest';

describe('urlRule', () => {
    const data = [
        { value: 'http://www.frontify.com', expected: true },
        { value: 'https://www.frontify.com', expected: true },
        { value: 'http://frontify.com', expected: true },
        { value: 'https://frontify.com', expected: true },
        { value: 'https://frontify.c', expected: false },
        { value: 'frontify', expected: false },
        { value: 'frontify.com', expected: false },
        { value: 'www.frontify.com', expected: false },
        { value: 'http://frontify', expected: false },
        { value: 'https://frontify', expected: false },
        { value: 'https//www.frontify.com', expected: false },
    ];

    test.each(data)('validate correctly values (value $value, expected $expected)', ({ value, expected }) => {
        expect(urlRule.validate(value)).toBe(expected);
    });
});
