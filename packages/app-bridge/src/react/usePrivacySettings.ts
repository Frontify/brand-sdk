/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type Handler } from 'mitt';
import { useEffect, useState } from 'react';

import { type AppBridgeBlock } from '../AppBridgeBlock';
import { type PrivacySettings } from '../types/PrivacySettings';

export const usePrivacySettings = (appBridge: AppBridgeBlock) => {
    const [privacySettings, setPrivacySettings] = useState<PrivacySettings>(appBridge.getPrivacySettings());

    useEffect(() => {
        const updateSettings: Handler<PrivacySettings> = (data) => setPrivacySettings({ ...privacySettings, ...data });

        window.emitter.on('AppBridge:PrivacySettingsChanged', updateSettings);

        return () => {
            window.emitter.off('AppBridge:PrivacySettingsChanged', updateSettings);
        };
    }, [privacySettings]);

    return privacySettings;
};
