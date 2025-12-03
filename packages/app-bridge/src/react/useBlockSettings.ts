/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useCallback, useEffect, useRef, useState } from 'react';

import { type AppBridgeBlock } from '../AppBridgeBlock';
import { mergeDeep } from '../utilities/object';

export type BlockSettingsUpdateEvent<T = Record<string, unknown>> = {
    blockId: number;
    blockSettings: T;
};

export const useBlockSettings = <T = Record<string, unknown>>(
    appBridge: AppBridgeBlock,
): [T, (newSettings: Partial<T>) => Promise<void>] => {
    const blockId = appBridge.context('blockId').get();

    // Save blockSettings in a ref so updateBlockSettings can safely be used as a react dependency
    const blockSettingsRef = useRef<T>(structuredClone(window.blockSettings[blockId]) as T);
    // eslint-disable-next-line react-hooks/refs
    const [blockSettings, setBlockSettings] = useState<T>(blockSettingsRef.current);

    // Add listener for block settings updates
    useEffect(() => {
        const updateBlockSettingsFromEvent = (event: BlockSettingsUpdateEvent) => {
            if (event.blockId === blockId) {
                const blockSettings = { ...event.blockSettings } as T;
                setBlockSettings(blockSettings);
                blockSettingsRef.current = blockSettings;
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
                    blockSettings: mergeDeep(blockSettingsRef.current, blockSettingsUpdate),
                });
            } catch (error) {
                console.error(error);
            }
        },
        // Stable reference to appBridge and blockId. These are not expected to change.
        [appBridge, blockId],
    );

    return [blockSettings, updateBlockSettings];
};
