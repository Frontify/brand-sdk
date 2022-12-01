/* (c) Copyright Frontify Ltd., all rights reserved. */

import { numericalOrPercentRule } from '../../../src/helpers/rules/numericalOrPercentRule';
import { describe, expect, test } from 'vitest';

describe('numericalOrPercentRule', () => {
    const data = [
        { value: '4', expected: true },
        { value: '1', expected: true },
        { value: '5', expected: true },
        { value: '10', expected: true },
        { value: '-1', expected: true },
        { value: '100%', expected: true },
        { value: '4px', expected: false },
        { value: '1px', expected: false },
        { value: '5px', expected: false },
        { value: '4rem', expected: false },
        { value: '10px', expected: false },
        { value: '-1px', expected: false },
        { value: '%', expected: false },
        { value: 'auto', expected: false },
        { value: ' 10px', expected: false },
        { value: '', expected: false },
        { value: 'abc', expected: false },
        { value: 'px', expected: false },
        { value: 'rem', expected: false },
    ];

    test.each(data)('validate correctly values (value $value, expected $expected)', ({ value, expected }) => {
        expect(numericalOrPercentRule.validate(value)).toBe(expected);
    });
});
