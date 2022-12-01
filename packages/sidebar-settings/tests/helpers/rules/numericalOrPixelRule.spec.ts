/* (c) Copyright Frontify Ltd., all rights reserved. */

import { numericalOrPixelRule } from '../../../src/helpers/rules/numericalOrPixelRule';
import { describe, expect, test } from 'vitest';

describe('numericalOrPixelRule', () => {
    const data = [
        { value: '4', expected: true },
        { value: '4px', expected: true },
        { value: '1', expected: true },
        { value: '1px', expected: true },
        { value: '5', expected: true },
        { value: '5px', expected: true },
        { value: '4rem', expected: false },
        { value: '10', expected: true },
        { value: '10px', expected: true },
        { value: '-1', expected: true },
        { value: '-1px', expected: true },
        { value: '100%', expected: false },
        { value: '%', expected: false },
        { value: ' 10px', expected: false },
        { value: '', expected: false },
        { value: 'auto', expected: false },
        { value: 'abc', expected: false },
        { value: 'px', expected: false },
        { value: 'rem', expected: false },
    ];

    test.each(data)('validate correctly values (value $value, expected $expected)', ({ value, expected }) => {
        expect(numericalOrPixelRule.validate(value)).toBe(expected);
    });
});
