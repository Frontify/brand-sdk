/* (c) Copyright Frontify Ltd., all rights reserved. */

import { closeAssetChooser, openAssetChooser } from '../registries/commands/AssetChooser';
import type { AppBridgeBlock } from '../AppBridgeBlock';
import type { Asset, AssetChooserOptions } from '../types';
import { EventUnsubscribeFunction } from '../AppBridge';

type UseAssetChooserType = {
    openAssetChooser: (callback: (selectedAsset: Asset[]) => void, options: AssetChooserOptions) => void;
    closeAssetChooser: () => void;
};

export const useAssetChooser = (appBridge: AppBridgeBlock): UseAssetChooserType => {
    let unsubscribe: EventUnsubscribeFunction;

    return {
        openAssetChooser: (callback, options) => {
            appBridge.dispatch(openAssetChooser(options));
            unsubscribe = appBridge.subscribe('assetsChosen', (selectedAssets) => {
                callback(selectedAssets.assets);
            });
        },
        closeAssetChooser: () => {
            unsubscribe?.();
            appBridge.dispatch(closeAssetChooser());
        },
    };
};
