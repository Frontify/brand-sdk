/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useEffect, useState } from 'react';

import { type AppBridgeTheme } from '../AppBridgeTheme';
import { type Asset, type ThemeTemplate } from '../types';
import { compareObjects } from '../utilities';

import { useThemeAssets } from './';

type HookArgs = {
    appBridge: AppBridgeTheme;
    template?: ThemeTemplate;
    documentId?: number;
    documentPageId?: number;
};

const getTemplateAssets = async ({
    appBridge,
    template,
    documentId,
    documentPageId,
}: HookArgs): Promise<Record<string, Asset[]>> => {
    if (template === 'cover') {
        return await appBridge.getCoverPageTemplateAssets();
    } else if (template === 'documentPage' && documentPageId) {
        return await appBridge.getDocumentPageTemplateAssets(documentPageId);
    } else if (template === 'library' && documentId) {
        return await appBridge.getLibraryPageTemplateAssets(documentId);
    }

    return {};
};

const addAssetIdsToTemplateAssetKey = async (
    key: string,
    assetIds: number[],
    { appBridge, template, documentId, documentPageId }: HookArgs,
): Promise<void> => {
    if (template === 'cover') {
        await appBridge.addAssetIdsToCoverPageTemplateAssetKey(key, assetIds);
    } else if (template === 'documentPage' && documentPageId) {
        await appBridge.addAssetIdsToDocumentPageTemplateAssetKey(documentPageId, key, assetIds);
    } else if (template === 'library' && documentId) {
        await appBridge.addAssetIdsToLibraryPageTemplateAssetKey(documentId, key, assetIds);
    }
};

const deleteAssetIdsFromTemplateAssetKey = async (
    key: string,
    assetIds: number[],
    { appBridge, template, documentId, documentPageId }: HookArgs,
): Promise<void> => {
    if (template === 'cover') {
        await appBridge.deleteAssetIdsFromCoverPageTemplateAssetKey(key, assetIds);
    } else if (template === 'documentPage' && documentPageId) {
        await appBridge.deleteAssetIdsFromDocumentPageTemplateAssetKey(documentPageId, key, assetIds);
    } else if (template === 'library' && documentId) {
        await appBridge.deleteAssetIdsFromLibraryPageTemplateAssetKey(documentId, key, assetIds);
    }
};

export const useTemplateAssets = (
    appBridge: AppBridgeTheme,
    template: ThemeTemplate,
    documentId?: number,
    documentPageId?: number,
) => {
    const [templateAssets, setTemplateAssets] = useState<Record<string, Asset[]>>({});
    const { themeAssets } = useThemeAssets(appBridge, template);
    const [customizedTemplateAssetsKeys, setCustomizedTemplateAssetsKeys] = useState<string[]>([]);
    const [mergedThemeAndTemplateAssets, setMergedThemeAndTemplateAssets] = useState<Record<string, Asset[]>>({});

    // Fetch the template assets on mount.
    // And add listener for template assets updates.
    useEffect(() => {
        let componentMounted = true;

        const updateTemplateAssetsFromEvent = (event: {
            template: ThemeTemplate;
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

        if (template) {
            const mountingFetch = async () => {
                const allTemplateAssets = await getTemplateAssets({
                    appBridge,
                    template,
                    documentId,
                    documentPageId,
                });

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
    }, [appBridge, documentId, documentPageId, template]);

    useEffect(() => {
        const overrides = [];
        const mergedAssets = { ...templateAssets };

        for (const field in themeAssets) {
            if (templateAssets[field] !== null && templateAssets[field] !== undefined) {
                overrides.push(field);
            } else if (themeAssets[field].length > 0) {
                mergedAssets[field] = themeAssets[field];
            }
        }

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCustomizedTemplateAssetsKeys(overrides);
        setMergedThemeAndTemplateAssets(mergedAssets);
    }, [themeAssets, templateAssets]);

    const emitUpdatedTemplateAssets = async () => {
        window.emitter.emit('AppBridge:TemplateAssetsUpdated', {
            template,
            documentId,
            documentPageId,
            templateAssets: await getTemplateAssets({
                appBridge,
                template,
                documentId,
                documentPageId,
            }),
            prevTemplateAssets: { ...templateAssets },
        });
    };

    const updateAssetIdsFromKey = async (key: string, newAssetIds: number[]) => {
        const currentTemplateAssets = await getTemplateAssets({
            appBridge,
            template,
            documentId,
            documentPageId,
        });
        const oldAssetIds = currentTemplateAssets[key]?.map((asset) => asset.id) ?? [];

        try {
            await deleteAssetIdsFromTemplateAssetKey(key, oldAssetIds, {
                appBridge,
                template,
                documentId,
                documentPageId,
            });
            await addAssetIdsToTemplateAssetKey(key, newAssetIds, {
                appBridge,
                template,
                documentId,
                documentPageId,
            });
        } catch (error) {
            console.error(error);
        }

        emitUpdatedTemplateAssets();
    };

    const deleteAssetIdsFromKey = async (key: string, assetIds: number[]) => {
        await deleteAssetIdsFromTemplateAssetKey(key, assetIds, {
            appBridge,
            template,
            documentId,
            documentPageId,
        });
        emitUpdatedTemplateAssets();
    };

    const addAssetIdsToKey = async (key: string, assetIds: number[]) => {
        await addAssetIdsToTemplateAssetKey(key, assetIds, {
            appBridge,
            template,
            documentId,
            documentPageId,
        });
        emitUpdatedTemplateAssets();
    };

    return {
        templateAssets: mergedThemeAndTemplateAssets,
        themeAssets,
        customizedTemplateAssetsKeys,
        addAssetIdsToKey,
        deleteAssetIdsFromKey,
        updateAssetIdsFromKey,
    };
};
