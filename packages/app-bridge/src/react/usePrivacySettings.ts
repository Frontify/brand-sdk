/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useEffect, useState } from 'react';
import type { Handler } from 'mitt';

import type { PrivacySettings } from '../types/PrivacySettings';
import { AppBridgeBlock } from '../AppBridgeBlock';

export const usePrivacySettings = (appBridge: AppBridgeBlock) => {
    const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
        assetDownloadEnabled: false,
        assetViewerEnabled: false,
    });

    useEffect(() => {
        const fetchPrivacySettings = async () => {
            const privacySettings = await appBridge.api({
                name: 'getPrivacySettings',
                payload: { portalId: appBridge.context('portalId').get() },
            });
            setPrivacySettings(privacySettings);
        };
        fetchPrivacySettings();
    }, [appBridge]);

    useEffect(() => {
        const updateSettings: Handler<PrivacySettings> = (data) => setPrivacySettings({ ...privacySettings, ...data });

        window.emitter.on('AppBridge:PrivacySettingsChanged', updateSettings);

        return () => {
            window.emitter.off('AppBridge:PrivacySettingsChanged', updateSettings);
        };
    }, [privacySettings]);

    return privacySettings;
};
