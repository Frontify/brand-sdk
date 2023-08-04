/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, it } from 'vitest';
import { relativeUrlRegex } from './relativeUrlRegex';

describe('Regex values', () => {
    it.each([
        {
            input: '/document/123',
            shouldMatch: true,
        },
        {
            input: '/r/123',
            shouldMatch: true,
        },
        {
            input: '/wrong/123',
            shouldMatch: false,
        },
        {
            input: '/r/',
            shouldMatch: false,
        },
        {
            input: '/document/',
            shouldMatch: false,
        },
    ])('should only match internal documents starting with /r/ or /document/', ({ input, shouldMatch }) => {
        const isMatching = relativeUrlRegex.test(input);
        expect(isMatching).toBe(shouldMatch);
    });
});
