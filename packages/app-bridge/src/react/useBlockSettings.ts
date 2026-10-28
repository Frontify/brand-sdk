/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useCallback, useEffect, useState } from 'react';

import { type AppBridgeBlock } from '../AppBridgeBlock';

type BlockSettingsState<T> = {
    contextSettings: Readonly<Record<string, unknown>>;
    blockSettings: T;
};

// Each hook works on its own copy, so a block mutating its settings in place can't change the host's context
const toBlockSettingsState = <T>(contextSettings: Readonly<Record<string, unknown>>): BlockSettingsState<T> => ({
    contextSettings,
    blockSettings: structuredClone(contextSettings) as T,
});

export const useBlockSettings = <T = Record<string, unknown>>(
    appBridge: AppBridgeBlock,
): [T, (newSettings: Partial<T>) => Promise<void>] => {
    const [blockSettingsState, setBlockSettingsState] = useState(() =>
        toBlockSettingsState<T>(appBridge.context('settings').get()),
    );

    useEffect(() => {
        const settingsContext = appBridge.context('settings');
        const syncBlockSettings = (contextSettings: Readonly<Record<string, unknown>>) => {
            setBlockSettingsState((currentState) =>
                currentState.contextSettings === contextSettings
                    ? currentState
                    : toBlockSettingsState<T>(contextSettings),
            );
        };

        syncBlockSettings(settingsContext.get());
        return settingsContext.subscribe(syncBlockSettings);
    }, [appBridge]);

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

    return [blockSettingsState.blockSettings, updateBlockSettings];
};
