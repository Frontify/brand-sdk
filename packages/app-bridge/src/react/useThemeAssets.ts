/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useEffect, useState } from 'react';

import type { AppBridgeTheme } from '../AppBridgeTheme';
import type { Asset } from '../types';
import { compareObjects } from '../utilities';

export const useThemeAssets = (appBridge: AppBridgeTheme, template?: 'documentPage' | 'library' | 'cover') => {
    const portalId = appBridge.getPortalId();

    const [themeAssets, setThemeAssets] = useState<Record<string, Asset[]>>({});

    const updateThemeAssetsFromEvent = (event: {
        template?: 'documentPage' | 'library' | 'cover';
        portalId: number;
        themeAssets: Record<string, Asset[]>;
        prevThemeAssets: Record<string, Asset[]>;
    }) => {
        if (
            template &&
            event.template === template &&
            event.portalId === portalId &&
            !compareObjects(event.themeAssets, event.prevThemeAssets)
        ) {
            setThemeAssets(event.themeAssets);
        }
    };

    const getThemeAssets = async (): Promise<Record<string, Asset[]>> => {
        return template
            ? await appBridge.getThemeAssets(template)
            : new Promise((resolve) => {
                  resolve({});
              });
    };

    const addAssetIdsToThemeAssetKey = async (key: string, assetIds: number[]): Promise<void> => {
        await appBridge.addAssetIdsToThemeAssetKey(key, assetIds, template);
    };

    const deleteAssetIdsFromThemeAssetKey = async (key: string, assetIds: number[]): Promise<void> => {
        await appBridge.deleteAssetIdsFromThemeAssetKey(key, assetIds, template);
    };

    // Fetch the theme assets on mount.
    // And add listener for theme assets updates.
    useEffect(() => {
        let componentMounted = true;

        if (portalId) {
            const mountingFetch = async () => {
                const allThemeAssets = template ? await getThemeAssets() : {};

                if (componentMounted && template) {
                    setThemeAssets(allThemeAssets);
                }
            };
            mountingFetch();

            window.emitter.on('AppBridge:ThemeAssetsUpdated', updateThemeAssetsFromEvent);
        }

        return () => {
            componentMounted = false;
            window.emitter.off('AppBridge:ThemeAssetsUpdated', updateThemeAssetsFromEvent);
        };
    }, [appBridge]);

    const emitUpdatedThemeAssets = async () => {
        if (template) {
            window.emitter.emit('AppBridge:ThemeAssetsUpdated', {
                portalId,
                themeAssets: await getThemeAssets(),
                prevThemeAssets: { ...themeAssets },
                template,
            });
        }
    };

    const updateAssetIdsFromKey = async (key: string, newAssetIds: number[]) => {
        const currentThemeAssets = await getThemeAssets();
        const oldAssetIds = currentThemeAssets[key]?.map((asset) => asset.id) ?? [];

        try {
            await deleteAssetIdsFromThemeAssetKey(key, oldAssetIds);
            await addAssetIdsToThemeAssetKey(key, newAssetIds);
        } catch (error) {
            console.error(error);
        }

        emitUpdatedThemeAssets();
    };

    const deleteAssetIdsFromKey = async (key: string, assetIds: number[]) => {
        await deleteAssetIdsFromThemeAssetKey(key, assetIds);
        emitUpdatedThemeAssets();
    };

    const addAssetIdsToKey = async (key: string, assetIds: number[]) => {
        await addAssetIdsToThemeAssetKey(key, assetIds);
        emitUpdatedThemeAssets();
    };

    return {
        themeAssets,
        addAssetIdsToKey,
        deleteAssetIdsFromKey,
        updateAssetIdsFromKey,
    };
};
