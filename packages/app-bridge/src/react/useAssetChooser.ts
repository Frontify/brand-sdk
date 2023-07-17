/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { AppBridgeBlock } from '../AppBridgeBlock';
import type { Asset, AssetChooserOptions } from '../types';
import { closeAssetChooser, openAssetChooser } from '../commands/AssetChooser';

type UseAssetChooserType = {
    openAssetChooser: (callback: (selectedAsset: Asset[]) => void, options: AssetChooserOptions) => void;
    closeAssetChooser: () => void;
};

export const useAssetChooser = (appBridge: AppBridgeBlock): UseAssetChooserType => {
    return {
        openAssetChooser: (callback: (selectedAsset: Asset[]) => void, options: AssetChooserOptions) => {
            appBridge.dispatch(openAssetChooser(options));
            appBridge.subscribe('assetsChosen', callback);
        },
        closeAssetChooser: () => {
            appBridge.dispatch(closeAssetChooser());
        },
    };
};
