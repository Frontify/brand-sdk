/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useEffect, useState } from 'react';

import type { AppBridgeTheme } from '../AppBridgeTheme';
import type { Asset } from '../types';
import { compareObjects } from '../utilities';

export const useTemplateAssets = (
    appBridge: AppBridgeTheme,
    template?: 'documentPage' | 'library' | 'cover',
    documentId?: number,
    documentPageId?: number,
) => {
    const [templateAssets, setTemplateAssets] = useState<Record<string, Asset[]>>({});

    const updateTemplateAssetsFromEvent = (event: {
        template?: 'documentPage' | 'library' | 'cover';
        documentId?: number;
        documentPageId?: number;
        templateAssets: Record<string, Asset[]>;
        prevTemplateAssets: Record<string, Asset[]>;
    }) => {
        if (
            event.template === template &&
            event.documentId === documentId &&
            event.documentPageId === documentPageId &&
            !compareObjects(event.templateAssets, event.prevTemplateAssets)
        ) {
            setTemplateAssets(event.templateAssets);
        }
    };

    const getTemplateAssets = async (): Promise<Record<string, Asset[]>> => {
        if (template === 'cover') {
            return await appBridge.getCoverPageTemplateAssets();
        } else if (template === 'documentPage' && documentPageId) {
            return await appBridge.getDocumentPageTemplateAssets(documentPageId);
        } else if (template === 'library' && documentId) {
            return await appBridge.getLibraryPageTemplateAssets(documentId);
        }

        return {};
    };

    const addAssetIdsToTemplateAssetKey = async (key: string, assetIds: number[]): Promise<void> => {
        if (template === 'cover') {
            await appBridge.addAssetIdsToCoverPageTemplateAssetKey(key, assetIds);
        } else if (template === 'documentPage' && documentPageId) {
            await appBridge.addAssetIdsToDocumentPageTemplateAssetKey(documentPageId, key, assetIds);
        } else if (template === 'library' && documentId) {
            await appBridge.addAssetIdsToLibraryPageTemplateAssetKey(documentId, key, assetIds);
        }
    };

    const deleteAssetIdsFromTemplateAssetKey = async (key: string, assetIds: number[]): Promise<void> => {
        if (template === 'cover') {
            await appBridge.deleteAssetIdsFromCoverPageTemplateAssetKey(key, assetIds);
        } else if (template === 'documentPage' && documentPageId) {
            await appBridge.deleteAssetIdsFromDocumentPageTemplateAssetKey(documentPageId, key, assetIds);
        } else if (template === 'library' && documentId) {
            await appBridge.deleteAssetIdsFromLibraryPageTemplateAssetKey(documentId, key, assetIds);
        }
    };

    // Fetch the template assets on mount.
    // And add listener for template assets updates.
    useEffect(() => {
        let componentMounted = true;

        if (template) {
            const mountingFetch = async () => {
                const allTemplateAssets = await getTemplateAssets();

                if (componentMounted) {
                    setTemplateAssets(allTemplateAssets);
                }
            };
            mountingFetch();

            window.emitter.on('AppBridge:TemplateAssetsUpdated', updateTemplateAssetsFromEvent);
        }

        return () => {
            componentMounted = false;
            window.emitter.off('AppBridge:TemplateAssetsUpdated', updateTemplateAssetsFromEvent);
        };
    }, [appBridge, documentId, documentPageId]);

    const emitUpdatedTemplateAssets = async () => {
        window.emitter.emit('AppBridge:TemplateAssetsUpdated', {
            template,
            documentId,
            documentPageId,
            templateAssets: await getTemplateAssets(),
            prevTemplateAssets: { ...templateAssets },
        });
    };

    const updateAssetIdsFromKey = async (key: string, newAssetIds: number[]) => {
        const currentTemplateAssets = await getTemplateAssets();
        const oldAssetIds = currentTemplateAssets[key]?.map((asset) => asset.id) ?? [];

        try {
            await deleteAssetIdsFromTemplateAssetKey(key, oldAssetIds);
            await addAssetIdsToTemplateAssetKey(key, newAssetIds);
        } catch (error) {
            console.error(error);
        }

        emitUpdatedTemplateAssets();
    };

    const deleteAssetIdsFromKey = async (key: string, assetIds: number[]) => {
        await deleteAssetIdsFromTemplateAssetKey(key, assetIds);
        emitUpdatedTemplateAssets();
    };

    const addAssetIdsToKey = async (key: string, assetIds: number[]) => {
        await addAssetIdsToTemplateAssetKey(key, assetIds);
        emitUpdatedTemplateAssets();
    };

    return {
        templateAssets,
        addAssetIdsToKey,
        deleteAssetIdsFromKey,
        updateAssetIdsFromKey,
    };
};
