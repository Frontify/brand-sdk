/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, it } from 'vitest';
import { getPrivacySettings } from './GetPrivacySettings';

const PORTAL_ID = 123;

describe('getPrivacySettings', () => {
    it('should create an action to get privacy settings with the correct name and payload', () => {
        const privacySettings = getPrivacySettings({
            portalId: PORTAL_ID,
        });

        expect(privacySettings.name).toBe('getPrivacySettings');
        expect(privacySettings.payload).toStrictEqual({
            portalId: PORTAL_ID,
        });
    });
});
