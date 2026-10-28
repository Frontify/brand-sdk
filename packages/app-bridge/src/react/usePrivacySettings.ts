/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useEffect, useState } from 'react';

import { type AppBridgeBlock } from '../AppBridgeBlock';
import { type PrivacySettings } from '../types/PrivacySettings';

export const usePrivacySettings = (appBridge: AppBridgeBlock): PrivacySettings => {
    const [privacySettings, setPrivacySettings] = useState<PrivacySettings>(() =>
        appBridge.context('privacySettings').get(),
    );

    useEffect(() => {
        setPrivacySettings(appBridge.context('privacySettings').get());
        return appBridge.context('privacySettings').subscribe(setPrivacySettings);
    }, [appBridge]);

    return privacySettings;
};
