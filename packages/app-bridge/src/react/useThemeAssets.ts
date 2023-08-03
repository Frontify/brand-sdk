/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useEffect, useState } from 'react';

import type { AppBridgeTheme } from '../AppBridgeTheme';
import type { Asset } from '../types';
import { compareObjects } from '../utilities';

export const useThemeAssets = (appBridge: AppBridgeTheme) => {
    const portalId = appBridge.getPortalId();

    const [themeAssets, setThemeAssets] = useState<Record<string, Asset[]>>({});

    const updateThemeAssetsFromEvent = (event: {
        portalId: number;
        themeAssets: Record<string, Asset[]>;
        prevThemeAssets: Record<string, Asset[]>;
    }) => {
        if (event.portalId === portalId && !compareObjects(event.themeAssets, event.prevThemeAssets)) {
            setThemeAssets(event.themeAssets);
        }
    };

    const getThemeAssets = async (): Promise<Record<string, Asset[]>> => {
        return await appBridge.getThemeAssets();
    };

    const addAssetIdsToThemeAssetKey = async (key: string, assetIds: number[]): Promise<void> => {
        await appBridge.addAssetIdsToThemeAssetKey(key, assetIds);
    };

    const deleteAssetIdsFromThemeAssetKey = async (key: string, assetIds: number[]): Promise<void> => {
        await appBridge.deleteAssetIdsFromThemeAssetKey(key, assetIds);
    };

    // Fetch the theme assets on mount.
    // And add listener for theme assets updates.
    useEffect(() => {
        let componentMounted = true;

        if (portalId) {
            const mountingFetch = async () => {
                const allThemeAssets = await getThemeAssets();

                if (componentMounted) {
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
        window.emitter.emit('AppBridge:ThemeAssetsUpdated', {
            portalId,
            themeAssets: await getThemeAssets(),
            prevThemeAssets: { ...themeAssets },
        });
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
