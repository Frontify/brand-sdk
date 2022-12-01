/* (c) Copyright Frontify Ltd., all rights reserved. */

import { generatePaddingString } from '../../src/helpers/generatePaddingString';
import { describe, expect, test } from 'vitest';

describe('generatePaddingString', () => {
    test('It should return the padding spider array as a sorted padding string', () => {
        const result = generatePaddingString(['10px', '20px', '30px', '40px']);
        expect(result).toEqual('10px 30px 40px 20px');
    });
    test('It should handle falsey values by replacing them with "0px"', () => {
        const result = generatePaddingString([null, '20px', null, null]);
        expect(result).toEqual('0px 0px 0px 20px');
    });
    test('It should return "0px" if spider input array is empty', () => {
        const result = generatePaddingString([]);
        expect(result).toEqual('0px');
    });
    test('It should not fail if array is smaller than 4 items', () => {
        const result = generatePaddingString(['4px', null, '1px']);
        expect(result).toEqual('4px 1px 0px 0px');
    });
});
