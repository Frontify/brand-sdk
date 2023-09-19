/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useCallback, useEffect, useState } from 'react';

import type { AppBridgeBlock } from '../AppBridgeBlock';
import type { Asset } from '../types';
import { compareObjects } from '../utilities';

export const useBlockAssets = (appBridge: AppBridgeBlock) => {
    const blockId = appBridge.getBlockId();

    const [blockAssets, setBlockAssets] = useState<Record<string, Asset[]>>({});

    const updateBlockAssetsFromEvent = useCallback(
        (event: {
            blockId: number;
            blockAssets: Record<string, Asset[]>;
            prevBlockAssets: Record<string, Asset[]>;
        }) => {
            if (event.blockId === blockId && !compareObjects(event.blockAssets, event.prevBlockAssets)) {
                setBlockAssets(event.blockAssets);
            }
        },
        [blockId],
    );

    // Fetch the block assets on mount.
    // And add listener for block assets updates.
    useEffect(() => {
        let componentMounted = true;

        if (blockId) {
            const mountingFetch = async () => {
                const allBlockAssets = await appBridge.getBlockAssets();
                if (componentMounted) {
                    setBlockAssets(allBlockAssets);
                }
            };
            mountingFetch();

            window.emitter.on('AppBridge:BlockAssetsUpdated', updateBlockAssetsFromEvent);
        }

        return () => {
            componentMounted = false;
            window.emitter.off('AppBridge:BlockAssetsUpdated', updateBlockAssetsFromEvent);
        };
    }, [appBridge, blockId, updateBlockAssetsFromEvent]);

    const emitUpdatedBlockAssets = async () => {
        window.emitter.emit('AppBridge:BlockAssetsUpdated', {
            blockId,
            blockAssets: await appBridge.getBlockAssets(),
            prevBlockAssets: { ...blockAssets },
        });
    };

    const updateAssetIdsFromKey = async (key: string, newAssetIds: number[]) => {
        const currentBlockAssets = await appBridge.getBlockAssets();
        const oldAssetIds = currentBlockAssets[key]?.map((asset) => asset.id) ?? [];

        try {
            if (appBridge.getTranslationLanguage() === '') {
                console.info('Default language is selected. Deleting previous assets');
                await appBridge.deleteAssetIdsFromBlockAssetKey(key, oldAssetIds);
            } else {
                console.info('Translated language is selected. Not deleting assets');
            }
            await appBridge.addAssetIdsToBlockAssetKey(key, newAssetIds);
        } catch (error) {
            console.error(error);
        }

        emitUpdatedBlockAssets();
    };

    const deleteAssetIdsFromKey = async (key: string, assetIds: number[]) => {
        await appBridge.deleteAssetIdsFromBlockAssetKey(key, assetIds);
        emitUpdatedBlockAssets();
    };

    const addAssetIdsToKey = async (key: string, assetIds: number[]) => {
        await appBridge.addAssetIdsToBlockAssetKey(key, assetIds);
        emitUpdatedBlockAssets();
    };

    return {
        blockAssets,
        addAssetIdsToKey,
        deleteAssetIdsFromKey,
        updateAssetIdsFromKey,
    };
};
