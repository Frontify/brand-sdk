/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useState } from 'react';
import type { AppBridgeBlock } from '../AppBridgeBlock';
import type { Asset, AssetChooserOptions, BlockCommandResponse } from '../types';

export type UseAssetChooserType = {
    openAssetChooser: (callback: (selectedAsset: Asset[]) => void, options: AssetChooserOptions) => void;
    closeAssetChooser: () => void;
};

export const useAssetChooser = (appBridge: AppBridgeBlock): UseAssetChooserType => {
    const [assetChooser, setAssetChooser] = useState<BlockCommandResponse['AssetChooser.Open'] | null>(null);

    return {
        openAssetChooser: (callback, options) => {
            appBridge
                .dispatch('AssetChooser.Open', {
                    options,
                })
                .then((registeredAssetChooser) => {
                    registeredAssetChooser.on('AssetChosen', (selectedAssets) => callback(selectedAssets));
                    setAssetChooser(registeredAssetChooser);
                });
        },
        closeAssetChooser: () => {
            assetChooser?.close();
        },
    };
};
