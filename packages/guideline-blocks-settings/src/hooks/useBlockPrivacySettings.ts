/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type AppBridgeBlock, type PrivacySettings, useBlockSettings, usePrivacySettings } from '@frontify/app-bridge';

import { getSecurityGlobalControlId } from '../settings/securityDownloadable';
import { Security } from '../settings/types';

export type BlockPrivacySettingsOptions = {
    /**
     * Id passed to `getSecurityGlobalControlSetting`, if the block uses a custom one.
     */
    globalControlId?: string;
    /**
     * Id of the block's `getSecurityAssetViewerSetting` switch. Leave it out when the block has no such switch.
     */
    assetViewerId?: string;
    /**
     * Id of the block's `getSecurityDownloadableSetting` switch. Leave it out when the block has no such switch.
     */
    downloadableId?: string;
};

// An override the editor never touched shows its `defaultValue` in the sidebar, so it resolves to that same value.
const resolveOverride = (blockSettings: Record<string, unknown>, settingId: string, defaultValue: boolean) => {
    const value = blockSettings[settingId];
    return typeof value === 'boolean' ? value : defaultValue;
};

/**
 * Returns the privacy settings that apply to the block: the global ones, or the block's own overrides
 * when its security is set to custom. Anything the block has no override switch for stays global.
 */
export const useBlockPrivacySettings = (
    appBridge: AppBridgeBlock,
    { globalControlId, assetViewerId, downloadableId }: BlockPrivacySettingsOptions = {},
): PrivacySettings => {
    const globalPrivacySettings = usePrivacySettings(appBridge);
    const [blockSettings] = useBlockSettings(appBridge);

    if (blockSettings[getSecurityGlobalControlId(globalControlId)] !== Security.Custom) {
        return globalPrivacySettings;
    }

    return {
        assetViewerEnabled: assetViewerId
            ? resolveOverride(blockSettings, assetViewerId, true)
            : globalPrivacySettings.assetViewerEnabled,
        assetDownloadEnabled: downloadableId
            ? resolveOverride(blockSettings, downloadableId, false)
            : globalPrivacySettings.assetDownloadEnabled,
    };
};
