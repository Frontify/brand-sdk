/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, it } from 'vitest';

import { getLinkDestinations } from './GetLinkDestinations';

describe('GetLinkDestinations', () => {
    it('should return correct method name', () => {
        const linkDestinations = getLinkDestinations({ query: 'brand' });
        expect(linkDestinations.name).toBe('getLinkDestinations');
    });

    it('should return the payload it was given', () => {
        const linkDestinations = getLinkDestinations({ query: 'brand' });
        expect(linkDestinations.payload).toStrictEqual({ query: 'brand' });
    });
});
