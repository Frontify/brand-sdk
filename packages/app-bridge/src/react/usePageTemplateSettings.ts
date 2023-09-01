/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useEffect, useState } from 'react';

import type { AppBridgeTheme } from '../AppBridgeTheme';
import type { EmitterEvents } from '../types';

export const usePageTemplateSettings = <TPageTemplateSettings = Record<string, unknown>>(
    appBridge: AppBridgeTheme,
    template: 'cover' | 'documentPage' | 'library',
    documentOrDocumentPageId?: number,
) => {
    const [pageTemplateSettings, setPageTemplateSettings] = useState<Nullable<TPageTemplateSettings>>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const updateBlockSettingsFromEvent = (event: EmitterEvents['AppBridge:PageTemplateSettingsUpdated']) => {
            setPageTemplateSettings({ ...event.pageTemplateSettings } as TPageTemplateSettings);
        };

        const getInitialPageTemplateSettings = async () => {
            setIsLoading(true);

            if (template === 'cover') {
                const coverPageSettings = await appBridge.getCoverPageTemplateSettings<TPageTemplateSettings>();
                setPageTemplateSettings(coverPageSettings);
            } else if (template === 'documentPage') {
                if (documentOrDocumentPageId === undefined) {
                    console.error('Document ID is required for document page template settings');
                } else {
                    const documentSettings =
                        await appBridge.getDocumentPageTemplateSettings<TPageTemplateSettings>(
                            documentOrDocumentPageId,
                        );

                    setPageTemplateSettings(documentSettings);
                }
            } else if (template === 'library') {
                if (documentOrDocumentPageId === undefined) {
                    console.error('Document ID is required for library template settings');
                } else {
                    const librarySettings =
                        await appBridge.getLibraryPageTemplateSettings<TPageTemplateSettings>(documentOrDocumentPageId);
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
    }, [appBridge, documentOrDocumentPageId, template]);

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

    return { pageTemplateSettings, updatePageTemplateSettings, isLoading };
};
