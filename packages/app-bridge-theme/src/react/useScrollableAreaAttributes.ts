/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useSyncExternalStore } from 'react';

import { type AppBridgeTheme } from '../AppBridgeTheme.ts';

export const useScrollableAreaAttributes = (appBridge: AppBridgeTheme) => {
    return useSyncExternalStore(
        appBridge.context('scrollableAreaAttributes').subscribe,
        appBridge.context('scrollableAreaAttributes').get,
    );
};
