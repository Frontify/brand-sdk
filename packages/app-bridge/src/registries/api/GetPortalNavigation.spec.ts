/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, it } from 'vitest';

import { getPortalNavigation } from './GetPortalNavigation';

describe('GetPortalNavigation', () => {
    it('should return correct method name', () => {
        const portalNavigationCall = getPortalNavigation();
        expect(portalNavigationCall.name).toBe('getPortalNavigation');
    });
});
