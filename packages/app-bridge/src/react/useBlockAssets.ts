/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useCallback, useEffect, useState } from 'react';

import { type AppBridgeBlock } from '../AppBridgeBlock';
import { type Asset } from '../types';

export const useBlockAssets = (appBridge: AppBridgeBlock) => {
    const [blockAssets, setBlockAssets] = useState<Record<string, Asset[]>>(
        () => appBridge.context('assets').get() ?? {},
    );

    useEffect(() => {
        setBlockAssets(appBridge.context('assets').get() ?? {});
        return appBridge.context('assets').subscribe((nextAssets) => {
            setBlockAssets(nextAssets ?? {});
        });
    }, [appBridge]);

    const updateAssetIdsFromKey = useCallback(
        async (key: string, newAssetIds: number[]) => {
            try {
                await appBridge.api({ name: 'setAssetIdsByBlockAssetKey', payload: { key, assetIds: newAssetIds } });
            } catch (error) {
                console.error(error);
            }
        },
        [appBridge],
    );

    const deleteAssetIdsFromKey = useCallback(
        async (key: string, assetIds: number[]) => {
            await appBridge.deleteAssetIdsFromBlockAssetKey(key, assetIds);
        },
        [appBridge],
    );

    const addAssetIdsToKey = useCallback(
        async (key: string, assetIds: number[]) => {
            await appBridge.addAssetIdsToBlockAssetKey(key, assetIds);
        },
        [appBridge],
    );

    return {
        blockAssets,
        addAssetIdsToKey,
        deleteAssetIdsFromKey,
        updateAssetIdsFromKey,
    };
};
