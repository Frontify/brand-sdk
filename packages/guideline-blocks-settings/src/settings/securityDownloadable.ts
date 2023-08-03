/* (c) Copyright Frontify Ltd., all rights reserved. */

import { SettingBlock } from '..';
import { Security } from './types';

/**
 * Returns the downloadable security settings.
 *
 * @param {string} id custom id for the setting block
 * @param {string} globalControlId custom id for the global control setting block
 *
 * @returns {SettingBlock} Returns downloadable security settings.
 */

type SecurityDownloadableSettingType = {
    id?: string;
    globalControlId?: string;
};

export const getSecurityDownloadableSetting = (options?: SecurityDownloadableSettingType): SettingBlock => {
    const securityId = getSecurityGlobalControlId(options?.globalControlId);
    return {
        id: options?.id ? options.id : 'downloadable',
        type: 'switch',
        defaultValue: false,
        label: 'Downloadable',
        show: (bundle) => bundle.getBlock(securityId)?.value === Security.Custom,
    };
};

export const getSecurityGlobalControlId = (id?: string): string => {
    return id || 'security';
};
