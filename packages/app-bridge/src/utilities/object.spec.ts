/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, test } from 'vitest';

import { convertObjectCase, mergeDeep } from './object';

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

describe('convertObjectCase', () => {
    test('should convert snake case to camel case', () => {
        expect(convertObjectCase({ aba_snake: 1 }, 'camel')).toEqual({ abaSnake: 1 });
    });

    test('should convert camel case to snake case', () => {
        expect(convertObjectCase({ abaSnake: 1 }, 'snake')).toEqual({ aba_snake: 1 });
    });

    test('should convert snake case to camel case deep', () => {
        expect(convertObjectCase({ aba_snake: { bab_snake: 1 } }, 'camel')).toEqual({ abaSnake: { babSnake: 1 } });
    });

    test('should convert camel case to snakle case deep', () => {
        expect(convertObjectCase({ abaSnake: { babSnake: 1 } }, 'snake')).toEqual({ aba_snake: { bab_snake: 1 } });
    });

    test('should convert camel case to snakle case deep', () => {
        expect(convertObjectCase({ abaSnake: { babSnake: 1 } }, 'snake')).toEqual({ aba_snake: { bab_snake: 1 } });
    });
});
