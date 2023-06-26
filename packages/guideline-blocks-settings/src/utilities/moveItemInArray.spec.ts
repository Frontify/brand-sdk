/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, it } from 'vitest';
import { moveItemInArray } from './moveItemInArray';

describe('moveItemInArray', () => {
    it.each([
        [[], 0, 0, []],
        [[1, 2, 3], 0, 0, [1, 2, 3]],
        [[1, 2, 3], 0, 1, [2, 1, 3]],
        [[1, 2, 3], 1, 0, [2, 1, 3]],
        [[1, { a: 1 }, 3], 1, 0, [{ a: 1 }, 1, 3]],
        [[{ a: 1 }, { b: 1 }, { c: 1 }], 1, 0, [{ b: 1 }, { a: 1 }, { c: 1 }]],
    ])('move items accordingly', (items, from, to, expected) => {
        expect(expected).toEqual(moveItemInArray(items as number[], from, to));
    });
});
