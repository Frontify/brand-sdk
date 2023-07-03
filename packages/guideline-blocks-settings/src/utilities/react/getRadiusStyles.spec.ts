/* (c) Copyright Frontify Ltd., all rights reserved. */

import { Radius } from '../../settings/types';
import { getRadiusStyles } from './getRadiusStyles';
import { describe, expect, it } from 'vitest';

describe('getRadiusStyles', () => {
    it('should return border radius 0px', () => {
        expect(getRadiusStyles(Radius.None, false)).toEqual({
            borderRadius: '0px',
        });
    });

    it('should return border radius 4px', () => {
        expect(getRadiusStyles(Radius.Medium, false)).toEqual({
            borderRadius: '4px',
        });
    });

    it('should return custom radius of 20px', () => {
        expect(getRadiusStyles(Radius.None, true, 20)).toEqual({
            borderRadius: 20,
        });
    });
});
