/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useEffect, useState } from 'react';

import type { AppBridgeTheme } from '../AppBridgeTheme';
import type { EmitterEvents } from '../types';
import { useThemeSettings } from './';

export const usePageTemplateSettings = <TPageTemplateSettings = Record<string, unknown>>(
    appBridge: AppBridgeTheme,
    template: 'cover' | 'documentPage' | 'library',
    documentOrDocumentPageId?: number,
) => {
    const { themeSettings } = useThemeSettings(appBridge);
    const [pageTemplateSettings, setPageTemplateSettings] = useState<Nullable<TPageTemplateSettings>>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [customizedPageTemplateSettingsKeys, setCustomizedPageTemplateSettingsKeys] = useState<string[]>([]);
    const [mergedThemeAndPageTemplateSettings, setMergedThemeAndPageTemplateSettings] =
        useState<Nullable<TPageTemplateSettings & Record<string, unknown>>>(null);

    useEffect(() => {
        const updateBlockSettingsFromEvent = (event: EmitterEvents['AppBridge:PageTemplateSettingsUpdated']) => {
            setPageTemplateSettings({ ...event.pageTemplateSettings } as TPageTemplateSettings);
        };

        const getInitialPageTemplateSettings = async () => {
            setIsLoading(true);
            let loadedSettings: Nullable<TPageTemplateSettings> = null;

            if (template === 'cover') {
                loadedSettings = await appBridge.getCoverPageTemplateSettings<TPageTemplateSettings>();
            } else if (documentOrDocumentPageId === undefined) {
                console.error(`Document ID is required for ${template} template settings`);
                setMergedThemeAndPageTemplateSettings(null);
                setIsLoading(false);
                return;
            } else if (template === 'documentPage') {
                loadedSettings =
                    await appBridge.getDocumentPageTemplateSettings<TPageTemplateSettings>(documentOrDocumentPageId);
            } else if (template === 'library') {
                loadedSettings =
                    await appBridge.getLibraryPageTemplateSettings<TPageTemplateSettings>(documentOrDocumentPageId);
            }

            setIsLoading(false);
            setPageTemplateSettings(loadedSettings);
        };

        getInitialPageTemplateSettings();

        window.emitter.on('AppBridge:PageTemplateSettingsUpdated', updateBlockSettingsFromEvent);

        return () => {
            window.emitter.off('AppBridge:PageTemplateSettingsUpdated', updateBlockSettingsFromEvent);
        };
    }, [appBridge, documentOrDocumentPageId, template]);

    useEffect(() => {
        if (!themeSettings || !pageTemplateSettings) {
            return;
        }

        const overrides = [];
        const mergedSettings: Record<string, unknown> & TPageTemplateSettings = { ...pageTemplateSettings };

        for (const field of Object.keys(themeSettings)) {
            if (
                (pageTemplateSettings as Record<string, unknown>)[field] !== null &&
                (pageTemplateSettings as Record<string, unknown>)[field] !== undefined
            ) {
                overrides.push(field);
            } else {
                (mergedSettings as Record<string, unknown>)[field] = themeSettings[field];
            }
        }

        setCustomizedPageTemplateSettingsKeys(overrides);
        setMergedThemeAndPageTemplateSettings(mergedSettings);
    }, [themeSettings, pageTemplateSettings]);

    const updatePageTemplateSettings = async (pageTemplateSettingsUpdate: Partial<TPageTemplateSettings>) => {
        try {
            if (template === 'cover') {
                await appBridge.updateCoverPageTemplateSettings(pageTemplateSettingsUpdate);
            } else if (documentOrDocumentPageId === undefined) {
                console.error(`Document ID is required for ${template} template settings`);
                setIsLoading(false);
                return;
            } else if (template === 'documentPage') {
                await appBridge.updateDocumentPageTemplateSettings(
                    documentOrDocumentPageId,
                    pageTemplateSettingsUpdate,
                );
            } else if (template === 'library') {
                await appBridge.updateLibraryPageTemplateSettings(documentOrDocumentPageId, pageTemplateSettingsUpdate);
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

    return {
        pageTemplateSettings: mergedThemeAndPageTemplateSettings,
        customizedPageTemplateSettingsKeys,
        updatePageTemplateSettings,
        isLoading,
    };
};
