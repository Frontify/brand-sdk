/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useCallback, useEffect, useState } from 'react';

import { type AppBridgeBlock } from '../AppBridgeBlock';
import { type Asset } from '../types';

export const useBlockAssets = (appBridge: AppBridgeBlock) => {
    const [blockAssets, setBlockAssets] = useState<Record<string, Asset[]>>(
        () => appBridge.context('assets').get() ?? {},
    );

    useEffect(() => {
        const unsubscribe = appBridge.context('assets').subscribe((nextAssets) => {
            setBlockAssets(nextAssets ?? {});
        });

        return unsubscribe;
    }, [appBridge]);

    const emitUpdatedBlockAssets = useCallback(async () => {
        const updatedAssets = await appBridge.getBlockAssets();
        setBlockAssets(updatedAssets);
    }, [appBridge]);

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
