/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useCallback, useEffect, useRef } from 'react';

import { type EventUnsubscribeFunction } from '../AppBridge';
import { type AppBridgeBlock } from '../AppBridgeBlock';
import { closeAssetChooser, openAssetChooser } from '../registries/commands/AssetChooser';
import { type Asset, type AssetChooserOptions } from '../types';

type UseAssetChooserType = {
    openAssetChooser: (callback: (selectedAsset: Asset[]) => void, options: AssetChooserOptions) => void;
    closeAssetChooser: () => void;
};

export const useAssetChooser = (appBridge: AppBridgeBlock): UseAssetChooserType => {
    const unsubscribeRef = useRef<EventUnsubscribeFunction>();

    useEffect(() => {
        return () => {
            unsubscribeRef.current?.();
            unsubscribeRef.current = undefined;
        };
    }, []);

    const handleOpenAssetChooser = useCallback(
        (callback: (selectedAsset: Asset[]) => void, options: AssetChooserOptions) => {
            unsubscribeRef.current?.();
            appBridge.dispatch(openAssetChooser(options));
            unsubscribeRef.current = appBridge.subscribe('assetsChosen', (selectedAssets) => {
                callback(selectedAssets.assets);
            });
        },
        [appBridge],
    );

    const handleCloseAssetChooser = useCallback(() => {
        unsubscribeRef.current?.();
        unsubscribeRef.current = undefined;
        appBridge.dispatch(closeAssetChooser());
    }, [appBridge]);

    return {
        openAssetChooser: handleOpenAssetChooser,
        closeAssetChooser: handleCloseAssetChooser,
    };
};
