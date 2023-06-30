/* (c) Copyright Frontify Ltd., all rights reserved. */

import {useEffect, useState} from 'react';
import type { AppBridgeBlock } from '../AppBridgeBlock';
import type { Asset, AssetChooserOptions, CommandResponse } from '../types';

type UseAssetChooserType = {
    openAssetChooser: (callback: (selectedAsset: Asset[]) => void, options: AssetChooserOptions) => void;
    closeAssetChooser: () => void;
};

export const useAssetChooser = (appBridge: AppBridgeBlock): UseAssetChooserType => {
    const [assetChooser, setAssetChooser] = useState<Promise<CommandResponse['AssetChooser.Open']>>();

    return {
        openAssetChooser:  () => {
            setAssetChooser(appBridge.dispatch('AssetChooser.Open'));
        },
        closeAssetChooser: () => {
            assetChooser?.then((assetChooser) => {
                assetChooser.close();
            });
        },
    };
};
