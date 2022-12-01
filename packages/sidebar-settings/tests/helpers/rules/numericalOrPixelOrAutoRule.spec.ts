/* (c) Copyright Frontify Ltd., all rights reserved. */

import { numericalOrPixelOrAutoRule } from '../../../src/helpers/rules/numericalOrPixelOrAutoRule';
import { describe, expect, test } from 'vitest';

describe('numericalOrPixelOrAutoRule', () => {
    const data = [
        { value: '4', expected: true },
        { value: '4px', expected: true },
        { value: '1', expected: true },
        { value: '1px', expected: true },
        { value: '5', expected: true },
        { value: '5px', expected: true },
        { value: '10', expected: true },
        { value: '10px', expected: true },
        { value: '-1', expected: true },
        { value: '-1px', expected: true },
        { value: 'auto', expected: true },
        { value: '4rem', expected: false },
        { value: '100%', expected: false },
        { value: '%', expected: false },
        { value: ' 10px', expected: false },
        { value: '', expected: false },
        { value: 'abc', expected: false },
        { value: 'px', expected: false },
        { value: 'rem', expected: false },
    ];

    test.each(data)('validate correctly values (value $value, expected $value)', ({ value, expected }) => {
        expect(numericalOrPixelOrAutoRule.validate(value)).toBe(expected);
    });
});
