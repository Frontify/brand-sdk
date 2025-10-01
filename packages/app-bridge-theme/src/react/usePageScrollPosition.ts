/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useSyncExternalStore } from 'react';

import { type AppBridgeTheme } from '../AppBridgeTheme.ts';

export const usePageScrollPosition = (appBridge: AppBridgeTheme) => {
    return useSyncExternalStore(
        appBridge.context('pageScrollPosition').subscribe,
        appBridge.context('pageScrollPosition').get,
    );
};
