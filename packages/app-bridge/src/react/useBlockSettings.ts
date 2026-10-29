/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useCallback, useMemo, useSyncExternalStore } from 'react';

import { type AppBridgeBlock } from '../AppBridgeBlock';

export const useBlockSettings = <T = Record<string, unknown>>(
    appBridge: AppBridgeBlock,
): [T, (newSettings: Partial<T>) => Promise<void>] => {
    // `context()` returns a new object on every call, so keep `subscribe` stable to avoid resubscribing on every render.
    const subscribe = useCallback(
        (onStoreChange: () => void) => appBridge.context('settings').subscribe(onStoreChange),
        [appBridge],
    );
    const getSnapshot = useCallback(() => appBridge.context('settings').get(), [appBridge]);
    const contextSettings = useSyncExternalStore(subscribe, getSnapshot);

    // Each hook works on its own copy, so a block mutating its settings in place can't change the host's context
    const blockSettings = useMemo(() => structuredClone(contextSettings) as T, [contextSettings]);

    const updateBlockSettings = useCallback(
        async (blockSettingsUpdate: Partial<T>) => {
            try {
                await appBridge.updateBlockSettings(blockSettingsUpdate);
            } catch (error) {
                console.error(error);
            }
        },
        [appBridge],
    );

    return [blockSettings, updateBlockSettings];
};
