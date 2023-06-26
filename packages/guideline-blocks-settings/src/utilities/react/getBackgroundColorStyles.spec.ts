/* (c) Copyright Frontify Ltd., all rights reserved. */

import { getBackgroundColorStyles } from './getBackgroundColorStyles';
import { describe, expect, it } from 'vitest';

describe('getBackgroundColorStyles', () => {
    it('should return a rgba background color', () => {
        expect(getBackgroundColorStyles({ red: 0, green: 0, blue: 0, alpha: 0.5 })).toEqual({
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        });
    });

    it('should return a rgb background color', () => {
        expect(getBackgroundColorStyles({ red: 255, green: 255, blue: 255 })).toEqual({
            backgroundColor: 'rgb(255, 255, 255)',
        });
    });
});
