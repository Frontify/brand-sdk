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
            input: '/hub/167',
            shouldMatch: true,
        },
        {
            input: '/hub/167?tab=overview#section',
            shouldMatch: true,
        },
        {
            input: '/',
            shouldMatch: true,
        },
        {
            input: '/r/',
            shouldMatch: true,
        },
        {
            input: '//example.com',
            shouldMatch: false,
        },
        {
            input: 'hub/167',
            shouldMatch: false,
        },
        {
            input: 'https://example.com/hub/167',
            shouldMatch: false,
        },
        {
            input: '/hub/with space',
            shouldMatch: false,
        },
    ])('should only match root-relative urls ($input)', ({ input, shouldMatch }) => {
        const isMatching = relativeUrlRegex.test(input);
        expect(isMatching).toBe(shouldMatch);
    });
});
