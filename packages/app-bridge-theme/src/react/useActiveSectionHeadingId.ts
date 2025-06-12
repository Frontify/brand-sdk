/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useSyncExternalStore } from 'react';

import { type AppBridgeTheme } from '../AppBridgeTheme.ts';

export const useActiveSectionHeadingId = (appBridge: AppBridgeTheme) => {
    return useSyncExternalStore(
        appBridge.context('activeSectionHeadingId').subscribe,
        appBridge.context('activeSectionHeadingId').get,
    );
};
