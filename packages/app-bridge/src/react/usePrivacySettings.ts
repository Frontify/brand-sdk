/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useEffect, useState } from 'react';
import type { Handler } from 'mitt';

import type { PrivacySettings } from '../types/PrivacySettings';
import { AppBridgeBlock } from '../AppBridgeBlock';

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
