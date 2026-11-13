/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useCallback, useSyncExternalStore } from 'react';

import { type AppBridgeBlock } from '../AppBridgeBlock';
import { type PrivacySettings } from '../types/PrivacySettings';

export const usePrivacySettings = (appBridge: AppBridgeBlock): PrivacySettings => {
    // `context()` returns a new object on every call, so keep `subscribe` stable to avoid resubscribing on every render.
    const subscribe = useCallback(
        (onStoreChange: () => void) => appBridge.context('privacySettings').subscribe(onStoreChange),
        [appBridge],
    );
    const getSnapshot = useCallback(() => appBridge.context('privacySettings').get(), [appBridge]);

    return useSyncExternalStore(subscribe, getSnapshot);
};
