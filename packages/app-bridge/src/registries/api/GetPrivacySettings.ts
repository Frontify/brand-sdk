/* (c) Copyright Frontify Ltd., all rights reserved. */

import { PrivacySettings } from '../..';

export type GetPrivacySettingsPayload = {
    portalId: number;
};

export type GetPrivacySettingsResponse = PrivacySettings;

export const getPrivacySettings = (payload: GetPrivacySettingsPayload) => ({ name: 'getPrivacySettings', payload });
