/* (c) Copyright Frontify Ltd., all rights reserved. */

import { AppBridgeBlock } from '../AppBridgeBlock';
import { Asset } from '../types';

export const useAssetViewer = (appBridge: AppBridgeBlock) => {
    const open = async ({ token }: Asset) => {
        appBridge.dispatch('AssetViewer.Open', { token });
    };

    return {
        open,
    };
};
