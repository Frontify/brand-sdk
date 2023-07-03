/* (c) Copyright Frontify Ltd., all rights reserved. */

import {useEffect, useState} from 'react';
import type { AppBridgeBlock } from '../AppBridgeBlock';
import type { Asset, AssetChooserOptions, CommandResponse } from '../types';

type UseAssetChooserType = {
    openAssetChooser: (callback: (selectedAsset: Asset[]) => void, options: AssetChooserOptions) => void;
    closeAssetChooser: () => void;
};

export const useAssetChooser = (appBridge: AppBridgeBlock): UseAssetChooserType => {
    const [assetChooser, setAssetChooser] = useState<CommandResponse['AssetChooser.Open']>();

    useEffect(() => {
        if(assetChooser) {
            console.log('assetChooser', assetChooser);
        }
    }, [assetChooser]);

    return {
        openAssetChooser:  async () => {
            const dispatchResponse = await appBridge.dispatch('AssetChooser.Open');
            setAssetChooser(dispatchResponse);
        },
        closeAssetChooser: async () => {
            if(assetChooser) {
                assetChooser.close();
            }
        },
    };
};
