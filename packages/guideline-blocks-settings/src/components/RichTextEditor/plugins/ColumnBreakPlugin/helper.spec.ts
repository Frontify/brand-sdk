/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, it, test } from 'vitest';

import { columnClassMap, getResponsiveColumnClasses } from './helpers';

describe('RichTextEditor helpers', () => {
    it('should return empty string if no column count is provided', () => {
        expect(getResponsiveColumnClasses()).toBe('');
    });

    test.each([
        [1, columnClassMap[1]],
        [2, columnClassMap[2]],
        [3, columnClassMap[3]],
        [4, columnClassMap[4]],
        [123, columnClassMap[1]],
    ])('should return the proper classes for %i column count', (columnCount, expectedClasses) => {
        expect(getResponsiveColumnClasses(columnCount)).toBe(expectedClasses);
    });
});
