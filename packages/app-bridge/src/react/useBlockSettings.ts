/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useEffect, useState } from 'react';
import type { AppBridgeBlock } from '../AppBridgeBlock';
import { notifyBlockSettingsUpdated, offBlockSettingsUpdated, onBlockSettingsUpdated } from '../events';
import { BlockSettingsUpdateEvent } from '../types';

import { mergeDeep } from '../utilities';

export const useBlockSettings = <T = Record<string, unknown>>(
    appBridge: AppBridgeBlock,
): [T, (newSettings: Partial<T>) => Promise<void>] => {
    const blockId = appBridge.getBlockId();
    const [blockSettings, setBlockSettings] = useState<T>(structuredClone(window.blockSettings[blockId]) as T);

    // Add listener for block settings updates
    useEffect(() => {
        const updateBlockSettingsFromEvent = (event: BlockSettingsUpdateEvent) => {
            if (event.blockId === blockId) {
                setBlockSettings({ ...event.blockSettings } as T);
            }
        };

        onBlockSettingsUpdated(updateBlockSettingsFromEvent);

        return () => {
            offBlockSettingsUpdated(updateBlockSettingsFromEvent);
        };
    }, [blockId]);

    const updateBlockSettings = async (blockSettingsUpdate: Partial<T>) => {
        try {
            await appBridge.updateBlockSettings(blockSettingsUpdate);
            notifyBlockSettingsUpdated({
                blockId,
                blockSettings: mergeDeep(blockSettings, blockSettingsUpdate),
            });
        } catch (error) {
            console.error(error);
        }
    };

    return [blockSettings, updateBlockSettings];
};
