/* (c) Copyright Frontify Ltd., all rights reserved. */

import { AppBridgeBlock } from '../AppBridgeBlock';
import { openAssetViewer } from '../commands';
import { Asset } from '../types';

export const useAssetViewer = (appBridge: AppBridgeBlock) => {
    const open = ({ token }: Asset) => {
        appBridge.dispatch(openAssetViewer(token));
    };

    return {
        open,
    };
};
