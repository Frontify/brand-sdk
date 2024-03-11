/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useCallback, useEffect, useState } from 'react';

import { mergeDeep } from '../utilities/object';
import type { AppBridgeBlock } from '../AppBridgeBlock';

export type BlockSettingsUpdateEvent<T = Record<string, unknown>> = {
    blockId: number;
    blockSettings: T;
};

export const useBlockSettings = <T = Record<string, unknown>>(
    appBridge: AppBridgeBlock,
): [T, (newSettings: Partial<T>) => Promise<void>] => {
    const blockId = appBridge.context('blockId').get();
    const [blockSettings, setBlockSettings] = useState<T>(structuredClone(window.blockSettings[blockId]) as T);

    // Add listener for block settings updates
    useEffect(() => {
        const updateBlockSettingsFromEvent = (event: BlockSettingsUpdateEvent) => {
            if (event.blockId === blockId) {
                setBlockSettings({ ...event.blockSettings } as T);
            }
        };

        window.emitter.on('AppBridge:BlockSettingsUpdated', updateBlockSettingsFromEvent);

        return () => {
            window.emitter.off('AppBridge:BlockSettingsUpdated', updateBlockSettingsFromEvent);
        };
    }, [blockId]);

    const updateBlockSettings = useCallback(
        async (blockSettingsUpdate: Partial<T>) => {
            try {
                await appBridge.updateBlockSettings(blockSettingsUpdate);
                window.emitter.emit('AppBridge:BlockSettingsUpdated', {
                    blockId,
                    blockSettings: mergeDeep(blockSettings, blockSettingsUpdate),
                });
            } catch (error) {
                console.error(error);
            }
        },
        [appBridge, blockId, blockSettings],
    );

    return [blockSettings, updateBlockSettings];
};
