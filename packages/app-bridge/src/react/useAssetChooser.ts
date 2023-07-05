/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useEffect, useState } from 'react';
import type { AppBridgeBlock } from '../AppBridgeBlock';
import type { Asset, AssetChooserOptions, BlockCommandResponse } from '../types';

export type UseAssetChooserType = {
    openAssetChooser: (callback: (selectedAsset: Asset[]) => void, options: AssetChooserOptions) => void;
    closeAssetChooser: () => void;
};

export const useAssetChooser = (appBridge: AppBridgeBlock): UseAssetChooserType => {
    const [assetChooser, setAssetChooser] = useState<BlockCommandResponse['AssetChooser.Open'] | null>(null);
    const [shouldClose, setShouldClose] = useState(false);

    useEffect(() => {
        if (assetChooser && shouldClose) {
            assetChooser.close();
            setShouldClose(false);
            setAssetChooser(null);
        }
    }, [assetChooser, shouldClose]);

    return {
        openAssetChooser: (callback, options) => {
            const registeredAssetChooser = appBridge.dispatch('AssetChooser.Open', { options });
            registeredAssetChooser.on('AssetChosen', callback);
            setAssetChooser(registeredAssetChooser);
        },
        closeAssetChooser: () => {
            setShouldClose(true);
        },
    };
};
