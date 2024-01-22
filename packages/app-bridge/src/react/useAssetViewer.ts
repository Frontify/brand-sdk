/* (c) Copyright Frontify Ltd., all rights reserved. */

import { openAssetViewer } from '../registries/commands/AssetViewer';
import { type AppBridgeBlock } from '../AppBridgeBlock';
import { type Asset } from '../types';

export const useAssetViewer = (appBridge: AppBridgeBlock) => {
    const open = async ({ token }: Asset) => {
        appBridge.dispatch(openAssetViewer({ token }));
    };

    return {
        open,
    };
};
