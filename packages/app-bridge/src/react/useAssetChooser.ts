/* (c) Copyright Frontify Ltd., all rights reserved. */

import { closeAssetChooser, openAssetChooser } from '../registries/commands/AssetChooser';
import type { AppBridgeBlock } from '../AppBridgeBlock';
import type { Asset, AssetChooserOptions } from '../types';

type UseAssetChooserType = {
    openAssetChooser: (options: AssetChooserOptions, callback: (selectedAsset: Asset[]) => void) => void;
    closeAssetChooser: () => void;
};

export const useAssetChooser = (appBridge: AppBridgeBlock): UseAssetChooserType => {
    return {
        openAssetChooser: (options, callback) => {
            appBridge.dispatch(openAssetChooser(options));
            appBridge.subscribe('assetsChosen', (selectedAssets) => {
                callback(selectedAssets.assets);
            });
        },
        closeAssetChooser: () => {
            appBridge.dispatch(closeAssetChooser());
        },
    };
};
