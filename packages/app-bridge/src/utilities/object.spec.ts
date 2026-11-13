/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, test } from 'vitest';

import { mergeDeep } from './object';

describe('mergeDeep', () => {
    test('should return object if only one object', () => {
        expect(mergeDeep({ a: 1 })).toEqual({ a: 1 });
    });

    test('should return object if two objects', () => {
        expect(mergeDeep({ a: 1 }, { b: 2 })).toEqual({ a: 1, b: 2 });
    });

    test('should merge one level nested object', () => {
        expect(mergeDeep({ a: { b: 1 } }, { a: { c: 2 } })).toEqual({ a: { b: 1, c: 2 } });
    });

    test('should merge two level nested object', () => {
        expect(mergeDeep({ a: { b: { c: 2 } } }, { a: { d: 3 } })).toEqual({
            a: { b: { c: 2 }, d: 3 },
        });
    });
});
