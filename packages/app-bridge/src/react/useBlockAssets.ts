/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useEffect, useState } from 'react';

import { type AppBridgeBlock } from '../AppBridgeBlock';
import { type Asset } from '../types';
import { compareObjects } from '../utilities';

export const useBlockAssets = (appBridge: AppBridgeBlock) => {
    const blockId = appBridge.context('blockId').get();

    const [blockAssets, setBlockAssets] = useState<Record<string, Asset[]>>(
        () => appBridge.context('assets').get() ?? {},
    );

    const updateBlockAssetsFromEvent = (event: {
        blockId: number;
        blockAssets: Record<string, Asset[]>;
        prevBlockAssets: Record<string, Asset[]>;
    }) => {
        if (event.blockId === blockId && !compareObjects(event.blockAssets, event.prevBlockAssets)) {
            setBlockAssets(event.blockAssets);
        }
    };

    // Add listener for block assets updates.
    useEffect(() => {
        window.emitter.on('AppBridge:BlockAssetsUpdated', updateBlockAssetsFromEvent);

        return () => {
            window.emitter.off('AppBridge:BlockAssetsUpdated', updateBlockAssetsFromEvent);
        };
        // eslint-disable-next-line @eslint-react/exhaustive-deps
    }, [appBridge]);

    const emitUpdatedBlockAssets = async () => {
        window.emitter.emit('AppBridge:BlockAssetsUpdated', {
            blockId,
            blockAssets: await appBridge.getBlockAssets(),
            prevBlockAssets: { ...blockAssets },
        });
    };

    const updateAssetIdsFromKey = async (key: string, newAssetIds: number[]) => {
        try {
            await appBridge.api({ name: 'setAssetIdsByBlockAssetKey', payload: { key, assetIds: newAssetIds } });
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
