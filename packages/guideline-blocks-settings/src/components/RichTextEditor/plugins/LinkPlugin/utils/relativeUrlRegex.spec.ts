/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, it } from 'vitest';
import { relativeUrlRegex } from './relativeUrlRegex';

describe('Regex values', () => {
    it('should only match internal documents starting with /r/ or /document/', () => {
        const testData = [
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
        ];
        for (const data of testData) {
            const isMatching = relativeUrlRegex.test(data.input);
            expect(isMatching).toBe(data.shouldMatch);
        }
    });
});
