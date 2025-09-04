/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type EventUnsubscribeFunction } from '../AppBridge';
import { type AppBridgeBlock } from '../AppBridgeBlock';
import { closeAssetChooser, openAssetChooser } from '../registries/commands/AssetChooser';
import { type Asset, type AssetChooserOptions } from '../types';

type UseAssetChooserType = {
    openAssetChooser: (callback: (selectedAsset: Asset[]) => void, options: AssetChooserOptions) => void;
    closeAssetChooser: () => void;
};

// eslint-disable-next-line @eslint-react/no-unnecessary-use-prefix
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
