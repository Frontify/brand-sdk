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
    const [loadSettingsError, setLoadSettingsError] = useState(false);
    const [customOverrides, setCustomOverrides] = useState<string[]>([]);
    const [themeFieldsWhenOverrideIsNull, setThemeFieldsWhenOverrideIsNull] = useState<Record<string, unknown>>({});

    useEffect(() => {
        const updateBlockSettingsFromEvent = (event: EmitterEvents['AppBridge:PageTemplateSettingsUpdated']) => {
            setPageTemplateSettings({ ...event.pageTemplateSettings } as TPageTemplateSettings);
        };

        const getInitialPageTemplateSettings = async () => {
            if (template !== 'cover' && documentOrDocumentPageId === undefined) {
                console.error(`Document ID is required for ${template} template settings`);
                setLoadSettingsError(true);
                return;
            }

            setIsLoading(true);
            let loadedSettings: Nullable<TPageTemplateSettings> = null;

            if (template === 'cover') {
                loadedSettings = await appBridge.getCoverPageTemplateSettings<TPageTemplateSettings>();
            } else if (template === 'documentPage') {
                loadedSettings = await appBridge.getDocumentPageTemplateSettings<TPageTemplateSettings>(
                    documentOrDocumentPageId as number,
                );
            } else if (template === 'library') {
                loadedSettings = await appBridge.getLibraryPageTemplateSettings<TPageTemplateSettings>(
                    documentOrDocumentPageId as number,
                );
            }

            setIsLoading(false);
            setLoadSettingsError(false);
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

        for (const field of Object.keys(themeSettings)) {
            if (!pageTemplateSettings.hasOwnProperty(field)) {
                continue;
            }

            if (
                (pageTemplateSettings as Record<string, unknown>)[field] !== null &&
                (pageTemplateSettings as Record<string, unknown>)[field] !== undefined
            ) {
                setCustomOverrides((current) => (current.includes(field) ? current : [...current, field]));
                setThemeFieldsWhenOverrideIsNull((current) => ({
                    ...Object.fromEntries(
                        Object.keys(current)
                            .filter((key) => key !== field)
                            .map((key) => [key, current[key]]),
                    ),
                }));
            } else {
                setThemeFieldsWhenOverrideIsNull((current) => ({
                    ...current,
                    [field]: themeSettings[field],
                }));
                setCustomOverrides((current) => current.filter((override) => override !== field));
            }
        }
    }, [themeSettings, pageTemplateSettings]);

    const updatePageTemplateSettings = async (pageTemplateSettingsUpdate: Partial<TPageTemplateSettings>) => {
        try {
            if (template === 'cover') {
                await appBridge.updateCoverPageTemplateSettings(pageTemplateSettingsUpdate);
            } else if (template === 'documentPage') {
                if (documentOrDocumentPageId === undefined) {
                    console.error('Document ID is required for document page template settings');
                    return;
                }

                await appBridge.updateDocumentPageTemplateSettings(
                    documentOrDocumentPageId,
                    pageTemplateSettingsUpdate,
                );
            } else if (template === 'library') {
                if (documentOrDocumentPageId === undefined) {
                    console.error('Document ID is required for library template settings');
                    return;
                }

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
        pageTemplateSettings: loadSettingsError
            ? null
            : {
                  ...themeSettings,
                  ...pageTemplateSettings,
                  ...themeFieldsWhenOverrideIsNull,
              },
        customOverrides,
        updatePageTemplateSettings,
        isLoading,
    };
};
