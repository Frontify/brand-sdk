/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useCallback, useSyncExternalStore } from 'react';

import { type AppBridgeBlock } from '../AppBridgeBlock';

export const useEditorState = (appBridge: AppBridgeBlock): boolean => {
    // `context()` returns a new object on every call, so keep `subscribe` stable to avoid resubscribing on every render.
    const subscribe = useCallback(
        (onStoreChange: () => void) => appBridge.context('isEditing').subscribe(onStoreChange),
        [appBridge],
    );
    const getSnapshot = useCallback(() => appBridge.context('isEditing').get(), [appBridge]);

    return useSyncExternalStore(subscribe, getSnapshot);
};
