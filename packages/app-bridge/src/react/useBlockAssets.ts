/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useCallback, useEffect, useState } from 'react';

import { type AppBridgeBlock } from '../AppBridgeBlock';
import { type Asset } from '../types';
import { compareObjects } from '../utilities';

export const useBlockAssets = (appBridge: AppBridgeBlock) => {
    const blockId = appBridge.context('blockId').get();

    const [blockAssets, setBlockAssets] = useState<Record<string, Asset[]>>(
        () => appBridge.context('assets').get() ?? {},
    );

    useEffect(() => {
        // Subscribe to context changes for platforms that support context('assets')
        let unsubscribeContext: (() => void) | undefined;
        try {
            unsubscribeContext = appBridge.context('assets').subscribe((nextAssets) => {
                setBlockAssets(nextAssets ?? {});
            });
        } catch {
            // Fallback for older platform versions that don't support context('assets')
        }

        // Also listen to emitter events for cross-block updates
        const updateBlockAssetsFromEvent = (event: {
            blockId: number;
            blockAssets: Record<string, Asset[]>;
            prevBlockAssets: Record<string, Asset[]>;
        }) => {
            if (event.blockId === blockId && !compareObjects(event.blockAssets, event.prevBlockAssets)) {
                setBlockAssets(event.blockAssets);
            }
        };

        window.emitter.on('AppBridge:BlockAssetsUpdated', updateBlockAssetsFromEvent);

        return () => {
            unsubscribeContext?.();
            window.emitter.off('AppBridge:BlockAssetsUpdated', updateBlockAssetsFromEvent);
        };
    }, [appBridge, blockId]);

    const emitUpdatedBlockAssets = useCallback(async () => {
        const updatedAssets = await appBridge.getBlockAssets();
        window.emitter.emit('AppBridge:BlockAssetsUpdated', {
            blockId,
            blockAssets: updatedAssets,
            prevBlockAssets: { ...blockAssets },
        });
    }, [appBridge, blockId, blockAssets]);

    const updateAssetIdsFromKey = useCallback(
        async (key: string, newAssetIds: number[]) => {
            try {
                await appBridge.api({ name: 'setAssetIdsByBlockAssetKey', payload: { key, assetIds: newAssetIds } });
            } catch (error) {
                console.error(error);
            }
            await emitUpdatedBlockAssets();
        },
        [appBridge, emitUpdatedBlockAssets],
    );

    const deleteAssetIdsFromKey = useCallback(
        async (key: string, assetIds: number[]) => {
            await appBridge.deleteAssetIdsFromBlockAssetKey(key, assetIds);
            await emitUpdatedBlockAssets();
        },
        [appBridge, emitUpdatedBlockAssets],
    );

    const addAssetIdsToKey = useCallback(
        async (key: string, assetIds: number[]) => {
            await appBridge.addAssetIdsToBlockAssetKey(key, assetIds);
            await emitUpdatedBlockAssets();
        },
        [appBridge, emitUpdatedBlockAssets],
    );

    return {
        blockAssets,
        addAssetIdsToKey,
        deleteAssetIdsFromKey,
        updateAssetIdsFromKey,
    };
};
