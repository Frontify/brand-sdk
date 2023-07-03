/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useState } from 'react';
import type { AppBridgeBlock } from '../AppBridgeBlock';
import type { Asset, AssetChooserOptions, CommandResponse } from '../types';

type UseAssetChooserType = {
    openAssetChooser: (options: AssetChooserOptions) => void;
    closeAssetChooser: () => void;
};

export const useAssetChooser = (
    appBridge: AppBridgeBlock,
    onAssetChosenCallback?: (selectedAssets: Asset[]) => void,
): UseAssetChooserType => {
    const [assetChooser, setAssetChooser] = useState<CommandResponse['AssetChooser.Open'] | null>(null);

    return {
        openAssetChooser: async (options: AssetChooserOptions) => {
            const dispatchResponse = await appBridge.dispatch('AssetChooser.Open', { options });
            dispatchResponse.on(
                'AssetChooserAssetChosen',
                onAssetChosenCallback ? { callback: onAssetChosenCallback } : undefined,
            );
            setAssetChooser(dispatchResponse);
        },
        closeAssetChooser: async () => {
            if (assetChooser) {
                assetChooser.close();
            }
        },
    };
};
