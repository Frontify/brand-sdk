/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useState } from 'react';
import type { AppBridgeBlock } from '../AppBridgeBlock';
import type { Asset, AssetChooserOptions, CommandResponse } from '../types';

type UseAssetChooserType = {
    openAssetChooser: (callback: (selectedAsset: Asset[]) => void, options: AssetChooserOptions) => void;
    closeAssetChooser: () => void;
};

export const useAssetChooser = (appBridge: AppBridgeBlock): UseAssetChooserType => {
    const [assetChooser, setAssetChooser] = useState<CommandResponse['AssetChooser.Open']>();

    return {
        openAssetChooser: () => {
            if (!assetChooser) {
                setAssetChooser(appBridge.dispatch('AssetChooser.Open'));
            }
        },
        closeAssetChooser: () => {
            if (assetChooser) {
                assetChooser.close();
            }
        },
    };
};
