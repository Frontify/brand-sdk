/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type SettingBlock } from '../types';

import { getSecurityGlobalControlId } from './securityDownloadable';
import { Security } from './types';

/**
 * Returns the asset viewer security settings.
 *
 * @param {string} id custom id for the setting block
 * @param {string} globalControlId custom id for the global control setting block
 *
 * @returns {SettingBlock} Returns asset viewer security settings.
 */

type SecurityAssetViewerSettingType = {
    id?: string;
    globalControlId?: string;
};

export const getSecurityAssetViewerSetting = (options?: SecurityAssetViewerSettingType): SettingBlock => {
    const securityId = getSecurityGlobalControlId(options?.globalControlId);
    return {
        id: options?.id || 'assetViewerEnabled',
        type: 'switch',
        defaultValue: true,
        label: 'Asset viewer',
        info: "When disabled, viewers won't be able to open the asset in the asset detail view.",
        show: (bundle) => bundle.getBlock(securityId)?.value === Security.Custom,
    };
};
