/* (c) Copyright Frontify Ltd., all rights reserved. */

import { urlRule } from '../../../src';
import { describe, expect, test } from 'vitest';

/**
 * @vitest-environment happy-dom
 */
describe('urlRule', () => {
    const data = [
        { value: 'http://www.frontify.com', expected: true },
        { value: 'https://www.frontify.com', expected: true },
        { value: 'https://www.frontify.com#anchor?sort=name', expected: true },
        { value: 'http://frontify.com', expected: true },
        { value: 'https://frontify.com', expected: true },
        { value: 'http://frontify', expected: true },
        { value: 'https://frontify', expected: true },
        { value: 'frontify://login', expected: true },
        { value: 'frontify', expected: false },
        { value: 'frontify.com', expected: false },
        { value: 'www.frontify.com', expected: false },
        { value: 'https//www.frontify.com', expected: false },
        { value: '://www.frontify.com', expected: false },
        { value: '//www.frontify.com', expected: false },
    ];

    test.each(data)('validate correctly values (value $value, expected $expected)', ({ value, expected }) => {
        expect(urlRule.validate(value)).toBe(expected);
    });
});
