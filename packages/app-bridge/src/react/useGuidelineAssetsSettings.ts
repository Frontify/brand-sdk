/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useEffect, useState } from 'react';
import { GuidelineAssetsSettings } from '../types/GuidelineAssetSettings';
import { Handler } from 'mitt';

export const useGuidelineAssetsSettings = () => {
    const [assetSettings, setAssetSettings] = useState<GuidelineAssetsSettings>({
        imageAndVideoDownloadEnabled:
            window.application?.sandbox?.config?.context?.appearance?.privacy?.image.download === 'enable',
        assetViewerEnabled: !!window.application?.sandbox?.config?.context?.appearance?.asset_viewer_enabled,
    });

    useEffect(() => {
        const updateSettings: Handler<GuidelineAssetsSettings> = (data) =>
            setAssetSettings({ ...assetSettings, ...data });

        window.emitter.on('AppBridge:GuidelineAssetsSettingsChanged', updateSettings);

        return () => {
            window.emitter.off('AppBridge:GuidelineAssetsSettingsChanged', updateSettings);
        };
    }, [assetSettings]);

    return assetSettings;
};
