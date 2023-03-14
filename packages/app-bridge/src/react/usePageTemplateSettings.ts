/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useEffect, useState } from 'react';

import type { AppBridgeTheme } from '../AppBridgeTheme';
import type { EmitterEvents } from '../types';
import {
    mapFlatSettingsDottedNotationToHubApi,
    mapHubApiToFlatSettingsDottedNotation,
} from '../repositories/HubRepository';

export const usePageTemplateSettings = <T = Record<string, unknown>>(
    appBridge: AppBridgeTheme,
    template: 'cover' | 'document' | 'library',
    documentId?: number,
) => {
    const [pageTemplateSettings, setPageTemplateSettings] = useState<Nullable<T>>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const updateBlockSettingsFromEvent = (event: EmitterEvents['AppBridge:PageTemplateSettingsUpdated']) => {
            setPageTemplateSettings({ ...event.pageTemplateSettings } as T);
        };

        const getInitialPageTemplateSettings = async () => {
            setIsLoading(true);

            if (template === 'cover') {
                const coverPageSettings = await appBridge.getCoverPageSettings<T>();
                setPageTemplateSettings({
                    ...mapHubApiToFlatSettingsDottedNotation(coverPageSettings),
                    ...coverPageSettings,
                });
            } else if (template === 'document') {
                if (documentId === undefined) {
                    console.error('Document ID is required for document page template settings');
                } else {
                    const documentSettings = await appBridge.getDocumentSettings<T>(documentId);
                    setPageTemplateSettings(documentSettings);
                }
            } else if (template === 'library') {
                if (documentId === undefined) {
                    console.error('Document ID is required for library template settings');
                } else {
                    const librarySettings = await appBridge.getDocumentSettings<T>(documentId);
                    setPageTemplateSettings(librarySettings);
                }
            }

            setIsLoading(false);
        };

        getInitialPageTemplateSettings();

        window.emitter.on('AppBridge:PageTemplateSettingsUpdated', updateBlockSettingsFromEvent);

        return () => {
            window.emitter.off('AppBridge:PageTemplateSettingsUpdated', updateBlockSettingsFromEvent);
        };
    }, [appBridge, documentId, template]);

    const updatePageTemplateSettings = async (pageTemplateSettingsUpdate: Partial<T>) => {
        try {
            if (template === 'cover') {
                await appBridge.updateCoverPageSettings({
                    ...mapFlatSettingsDottedNotationToHubApi(pageTemplateSettingsUpdate),
                    ...pageTemplateSettingsUpdate,
                });
            } else if (template === 'document') {
                if (documentId === undefined) {
                    console.error('Document ID is required for document page template settings');
                    return;
                }
            } else if (template === 'library') {
                if (documentId === undefined) {
                    console.error('Document ID is required for library template settings');
                    return;
                }
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

    return { pageTemplateSettings, updatePageTemplateSettings, isLoading };
};
