/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type AppBridgeBlock } from '../AppBridgeBlock';
import { openAssetViewer } from '../registries/commands/AssetViewer';
import { type Asset } from '../types';

export const useAssetViewer = (appBridge: AppBridgeBlock) => {
    const open = async ({ token }: Asset, isDownloadable?: boolean) => {
        appBridge.dispatch(openAssetViewer({ token, isDownloadable }));
    };

    return {
        open,
    };
};
