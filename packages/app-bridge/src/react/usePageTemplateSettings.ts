/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useEffect, useState } from 'react';

import type { AppBridgeTheme } from '../AppBridgeTheme';
import {
    mapFlatSettingsDottedNotationToHubApi,
    mapHubApiToFlatSettingsDottedNotation,
} from '../repositories/HubRepository';

export type PageTemplateSettingsUpdateEvent<T = Record<string, unknown>> = {
    pageTemplateSettings: T;
};

export const usePageTemplateSettings = <T = Record<string, unknown>>(
    appBridge: AppBridgeTheme,
    template: 'cover' | 'document' | 'library',
): [Nullable<T>, (newSettings: Partial<T>) => Promise<void>] => {
    const [pageTemplateSettings, setPageTemplateSettings] = useState<Nullable<T>>(null as T);

    useEffect(() => {
        const updateBlockSettingsFromEvent = (event: PageTemplateSettingsUpdateEvent) => {
            setPageTemplateSettings({ ...event.pageTemplateSettings } as T);
        };

        const getInitialPageTemplateSettings = async () => {
            if (template === 'cover') {
                const coverPageSettings = await appBridge.getCoverPageSettings<T>();
                setPageTemplateSettings({
                    ...mapHubApiToFlatSettingsDottedNotation(coverPageSettings),
                    ...coverPageSettings,
                });
            }
        };

        getInitialPageTemplateSettings();

        window.emitter.on('AppBridge:PageTemplateSettingsUpdated', updateBlockSettingsFromEvent);

        return () => {
            window.emitter.off('AppBridge:PageTemplateSettingsUpdated', updateBlockSettingsFromEvent);
        };
    }, [appBridge, template]);

    const updatePageTemplateSettings = async (pageTemplateSettingsUpdate: Partial<T>) => {
        try {
            if (template === 'cover') {
                await appBridge.updateCoverPageSettings({
                    ...mapFlatSettingsDottedNotationToHubApi(pageTemplateSettingsUpdate),
                    ...pageTemplateSettingsUpdate,
                });
            }

            window.emitter.emit('AppBridge:PageTemplateSettingsUpdated', {
                pageTemplateSettings: {
                    ...pageTemplateSettings,
                    ...pageTemplateSettingsUpdate,
                },
            });
        } catch (error) {
            console.error(error);
        }
    };

    return [pageTemplateSettings, updatePageTemplateSettings];
};
