/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useEffect, useState } from 'react';

import { type AppBridgeTheme } from '../AppBridgeTheme';
import { type EmitterEvents, type ThemeTemplate } from '../types';

export const useThemeSettings = <T extends Record<ThemeTemplate, Record<string, unknown>>>(
    appBridge: AppBridgeTheme,
) => {
    const [themeSettings, setThemeSettings] = useState<Nullable<T>>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const updateThemeSettingsFromEvent = (event: EmitterEvents['AppBridge:ThemeSettingsUpdated']) => {
            setThemeSettings({ ...event.themeSettings } as T);
        };

        const getInitialThemeSettings = async () => {
            setIsLoading(true);

            const themeSettings = await appBridge.getThemeSettings<T>();
            setThemeSettings(themeSettings);

            setIsLoading(false);
        };

        getInitialThemeSettings();

        window.emitter.on('AppBridge:ThemeSettingsUpdated', updateThemeSettingsFromEvent);

        return () => {
            window.emitter.off('AppBridge:ThemeSettingsUpdated', updateThemeSettingsFromEvent);
        };
    }, [appBridge]);

    const updateThemeSettings = async (themeSettingsUpdate: Partial<T>) => {
        try {
            await appBridge.updateThemeSettings(themeSettingsUpdate);

            window.emitter.emit('AppBridge:ThemeSettingsUpdated', {
                themeSettings: {
                    cover: { ...themeSettings?.cover, ...themeSettingsUpdate.cover },
                    library: { ...themeSettings?.library, ...themeSettingsUpdate.library },
                    documentPage: { ...themeSettings?.documentPage, ...themeSettingsUpdate.documentPage },
                },
            });
        } catch (error) {
            console.error(error);
        }
    };

    return { themeSettings, updateThemeSettings, isLoading };
};
