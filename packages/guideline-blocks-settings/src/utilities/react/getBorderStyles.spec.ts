/* (c) Copyright Frontify Ltd., all rights reserved. */

import { BorderStyle } from '../../settings/types';
import { getBorderStyles } from './getBorderStyles';
import { describe, expect, it } from 'vitest';

describe('getBorderStyles', () => {
    it('should return the default border styles', () => {
        expect(getBorderStyles()).toEqual({
            borderStyle: 'solid',
            borderWidth: '1px',
            borderColor: 'rgb(234, 235, 235)',
        });
    });

    it('should return a dashed border style', () => {
        expect(getBorderStyles(BorderStyle.Dashed)).toEqual({
            borderStyle: 'dashed',
            borderWidth: '1px',
            borderColor: 'rgb(234, 235, 235)',
        });
    });

    it('should return a border width of 5px', () => {
        expect(getBorderStyles(BorderStyle.Solid, '5px')).toEqual({
            borderStyle: 'solid',
            borderWidth: '5px',
            borderColor: 'rgb(234, 235, 235)',
        });
    });

    it('should return a border color of rgba(255, 0, 0, 0.5)', () => {
        expect(getBorderStyles(BorderStyle.Solid, '1px', { red: 255, green: 0, blue: 0, alpha: 0.5 })).toEqual({
            borderStyle: 'solid',
            borderWidth: '1px',
            borderColor: 'rgba(255, 0, 0, 0.5)',
        });
    });
});
