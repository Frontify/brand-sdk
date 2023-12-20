/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type AppBridgeBlock } from '../AppBridgeBlock';
import { type Asset } from '../types';

export const useAssetViewer = (appBridge: AppBridgeBlock) => {
    const open = ({ token }: Asset) => {
        appBridge.openAssetViewer(token);
    };

    return {
        open,
    };
};
