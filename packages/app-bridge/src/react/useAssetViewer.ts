/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type AppBridgeBlock } from '../AppBridgeBlock';
import { openAssetViewer } from '../registries/commands/AssetViewer';
import { type Asset } from '../types';

// eslint-disable-next-line @eslint-react/no-unnecessary-use-prefix
export const useAssetViewer = (appBridge: AppBridgeBlock) => {
    const open = ({ token }: Asset, isDownloadable?: boolean) => {
        appBridge.dispatch(openAssetViewer({ token, isDownloadable }));
    };

    return {
        open,
    };
};
