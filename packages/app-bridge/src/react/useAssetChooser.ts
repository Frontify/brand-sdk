/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { AppBridgeBlock } from '../AppBridgeBlock';
import type { Asset, AssetChooserOptions } from '../types';

type UseAssetChooserType = {
    openAssetChooser: (callback: (selectedAsset: Asset[]) => void, options: AssetChooserOptions) => void;
    closeAssetChooser: () => void;
};

export const useAssetChooser = (appBridge: AppBridgeBlock): UseAssetChooserType => {
    return {
        openAssetChooser: appBridge.openAssetChooser.bind(appBridge),
        closeAssetChooser: appBridge.closeAssetChooser.bind(appBridge),
    };
};
