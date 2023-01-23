/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, it } from 'vitest';
import { rgbObjectToRgbString, rgbStringToRgbObject } from './color';

describe('Color', () => {
    describe('rgbStringToRgbObject', () => {
        it.each([
            { input: 'rgb(1,2,3)', expected: { red: 1, green: 2, blue: 3, alpha: 1 } },
            { input: 'rgb(1, 2, 3)', expected: { red: 1, green: 2, blue: 3, alpha: 1 } },
            { input: 'rgb( 1,  2,  3 )', expected: { red: 1, green: 2, blue: 3, alpha: 1 } },
            { input: 'rgba(1,2,3,0.6)', expected: { red: 1, green: 2, blue: 3, alpha: 0.6 } },
            { input: 'rgba(1, 2, 3, 0.6)', expected: { red: 1, green: 2, blue: 3, alpha: 0.6 } },
            { input: 'rgba( 1    ,  2  ,  3 , 0.6 )', expected: { red: 1, green: 2, blue: 3, alpha: 0.6 } },
            { input: '    rgba( 1    ,  2  ,  3 , 0.6 )    ', expected: { red: 1, green: 2, blue: 3, alpha: 0.6 } },
            { input: 'rgb(1, 2, 3);    ', expected: { red: 1, green: 2, blue: 3, alpha: 1 } },
            { input: 'rgba(1, 2, 3, 0.6);    ', expected: { red: 1, green: 2, blue: 3, alpha: 0.6 } },
        ])('convert rgb(a) string to object', ({ input, expected }) => {
            expect(rgbStringToRgbObject(input)).toStrictEqual(expected);
        });

        it.each(['', 'color', '   rgb', 'rgb    ', '   rgb   '])('throw error on wrong string', (input) => {
            expect(() => rgbStringToRgbObject(input)).toThrowError();
        });
    });

    describe('rgbObjectToRgbString', () => {
        it('should return a valid RGB string when given an object with R, G, and B.', () => {
            const color = { red: 255, green: 99, blue: 71 };
            expect(rgbObjectToRgbString(color)).toBe('rgb(255, 99, 71)');
        });

        it('should return a valid RGBA string when given an object with R, G, B, and A.', () => {
            const color = { red: 255, green: 99, blue: 71, alpha: 0.5 };
            expect(rgbObjectToRgbString(color)).toBe('rgba(255, 99, 71, 0.5)');
        });

        it('should return a valid RGB string when given an object with 255 R, G, and B.', () => {
            const color = { red: 255, green: 255, blue: 255 };
            expect(rgbObjectToRgbString(color)).toBe('rgb(255, 255, 255)');
        });

        it('should return a valid RGB string when given an object with 0 R, G, and B.', () => {
            const color = { red: 0, green: 0, blue: 0 };
            expect(rgbObjectToRgbString(color)).toBe('rgb(0, 0, 0)');
        });

        it('should return a valid RGBA string when given an object with 255 R, G, B and a valid A.', () => {
            const color = { red: 255, green: 255, blue: 255, alpha: 1 };
            expect(rgbObjectToRgbString(color)).toBe('rgba(255, 255, 255, 1)');
        });

        it('should return a valid RGBA string when given an object with 0 R, G, B and a valid A.', () => {
            const color = { red: 0, green: 0, blue: 0, alpha: 1 };
            expect(rgbObjectToRgbString(color)).toBe('rgba(0, 0, 0, 1)');
        });
    });
});
