/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, it } from 'vitest';

import { parseLegacyColor, toLegacyColor } from './color';

const MAX_ALPHA_BYTE = 255;
const ALPHA_HUNDREDTHS = 100;

describe('parseLegacyColor', () => {
    it.each([
        { input: 'rgb(255, 0, 0)', expected: '#ff0000' },
        { input: 'rgba(255, 0, 0, 1)', expected: '#ff0000' },
        { input: 'rgba(255, 0, 0, 0.5)', expected: '#ff000080' },
        { input: '#F00', expected: '#ff0000' },
        { input: '#FF0000', expected: '#ff0000' },
        { input: '#FF000080', expected: '#ff000080' },
        { input: '#ff0000ff', expected: '#ff0000' },
    ])('should read $input as $expected (MIG-23)', ({ input, expected }) => {
        expect(parseLegacyColor(input)).toBe(expected);
    });

    it.each([
        'red',
        'hsl(0, 100%, 50%)',
        '#f008',
        '#ff00',
        'rgb(100%, 0%, 0%)',
        'rgb 0 0 0',
        'rgb(0, 0, 0',
        'transparent',
        '',
        '#',
        'rgb(',
    ])('should reject the colour %j (MIG-23)', (input) => {
        expect(parseLegacyColor(input)).toBeNull();
    });

    it.each([undefined, null, 255, true, { r: 255 }, ['#ff0000']])(
        'should reject the value %j that is not a string (MIG-23)',
        (input) => {
            expect(parseLegacyColor(input)).toBeNull();
        },
    );
});

describe('toLegacyColor', () => {
    it.each([
        { input: '#ff0000', expected: 'rgba(255, 0, 0, 1.00)' },
        { input: '#ff000080', expected: 'rgba(255, 0, 0, 0.50)' },
        { input: '#0a141e', expected: 'rgba(10, 20, 30, 1.00)' },
        { input: '#11223300', expected: 'rgba(17, 34, 51, 0.00)' },
    ])('should write $input as $expected with two decimals of alpha (MIG-23)', ({ input, expected }) => {
        expect(toLegacyColor(input)).toBe(expected);
    });

    it.each(['not a colour', '', '#12'])('should not write the unreadable colour %j (MIG-23)', (input) => {
        expect(toLegacyColor(input)).toBeNull();
    });

    it('should read back every alpha byte of a hex8 colour unchanged (MIG-23)', () => {
        for (let byte = 0; byte <= MAX_ALPHA_BYTE; byte++) {
            const color = parseLegacyColor(`#ff0000${byte.toString(16).padStart(2, '0')}`);

            expect(parseLegacyColor(toLegacyColor(color ?? ''))).toBe(color);
        }
    });

    it('should write every two-decimal alpha back as the same rgba string (MIG-23)', () => {
        for (let hundredths = 0; hundredths <= ALPHA_HUNDREDTHS; hundredths++) {
            const rgba = `rgba(0, 128, 255, ${(hundredths / ALPHA_HUNDREDTHS).toFixed(2)})`;

            expect(toLegacyColor(parseLegacyColor(rgba) ?? '')).toBe(rgba);
        }
    });

    it.each(['rgba(0, 128, 255, 0.42)', '#AABBCC', '#f00', 'rgb(1, 2, 3)'])(
        'should read back the colour written for %s (MIG-23)',
        (input) => {
            const hex = parseLegacyColor(input);
            expect(hex).not.toBeNull();

            expect(parseLegacyColor(toLegacyColor(hex ?? ''))).toBe(hex);
        },
    );
});
