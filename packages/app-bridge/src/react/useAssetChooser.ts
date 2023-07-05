/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useState } from 'react';
import type { AppBridgeBlock } from '../AppBridgeBlock';
import type { Asset, AssetChooserOptions, BlockCommandResponse } from '../types';

export type UseAssetChooserType = {
    openAssetChooser: (callback: (selectedAsset: Asset[]) => void, options: AssetChooserOptions) => Promise<void>;
    closeAssetChooser: () => void;
};

export const useAssetChooser = (appBridge: AppBridgeBlock): UseAssetChooserType => {
    const [assetChooser, setAssetChooser] = useState<BlockCommandResponse['AssetChooser.Open'] | null>(null);

    return {
        openAssetChooser: async (callback, options) => {
            const registeredAssetChooser = await appBridge.dispatch('AssetChooser.Open', { options });
            registeredAssetChooser.on('AssetChosen', callback);
            setAssetChooser(registeredAssetChooser);
        },
        closeAssetChooser: () => {
            assetChooser?.close();
            setAssetChooser(null);
        },
    };
};
