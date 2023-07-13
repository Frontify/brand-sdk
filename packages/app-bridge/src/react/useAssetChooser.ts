/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { AppBridgeBlock } from '../AppBridgeBlock';
import { closeAssetChooser, openAssetChooser } from '../commands/AssetChooser';
import { type Asset, type AssetChooserOptions } from '../types';

export type UseAssetChooserType = {
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
