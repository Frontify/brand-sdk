/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, it } from 'vitest';

import { moveInArray } from './array';

describe('moveInArray', () => {
    it('moves an array item to a different position', () => {
        const array = [1, 2, 3, 4, 5];

        const result1 = moveInArray(array, 2, 0);
        expect(result1).toEqual([3, 1, 2, 4, 5]);

        const result2 = moveInArray(array, 4, 2);
        expect(result2).toEqual([1, 2, 5, 3, 4]);
    });

    it('handles negative "to" index correctly', () => {
        const array = [1, 2, 3, 4, 5];

        const result = moveInArray(array, 0, -1);
        expect(result).toEqual([2, 3, 4, 5, 1]);
    });

    it('returns a new array without modifying the original array', () => {
        const array = [1, 2, 3, 4, 5];

        const result = moveInArray(array, 2, 0);

        expect(result).toEqual([3, 1, 2, 4, 5]);

        expect(array).toEqual([1, 2, 3, 4, 5]);

        expect(result).not.toBe(array);
    });

    it('does not skip falsy values in the array', () => {
        const array = [1, null, 2, undefined, -1, 3];

        const result = moveInArray(array, 0, 4);
        expect(result).toEqual([null, 2, undefined, -1, 1, 3]);
    });
});
