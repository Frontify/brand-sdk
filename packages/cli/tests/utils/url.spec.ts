/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, test } from 'vitest';
import { getValidInstanceUrl } from '../../src/utils/url.js';

describe('URL utils', () => {
    describe('getValidInstanceUrl', () => {
        test('should correctly give hostname of a given domain name', () => {
            const domainNames = [
                'weare.frontify.com',
                'weare.frontify.com/',
                'weare.frontify.com//',
                'weare.frontify.com///////',
                'weare.frontify.com/dashboard',
                'https://weare.frontify.com',
                'http://weare.frontify.com',
            ];

            for (const domainName of domainNames) {
                const actual = getValidInstanceUrl(domainName);
                expect(actual).toBe('weare.frontify.com');
            }
        });
    });
});
