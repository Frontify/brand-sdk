/* (c) Copyright Frontify Ltd., all rights reserved. */

import { BlockSettingsEvents, BlockSettingsUpdateCallback } from '../types';

const APP_BRIDGE_BLOCK_SETTINGS_UPDATED_EVENT = BlockSettingsEvents.BlockSettingsUpdated;

export const onBlockSettingsUpdated = (callback: BlockSettingsUpdateCallback) => {
    window.emitter.on(APP_BRIDGE_BLOCK_SETTINGS_UPDATED_EVENT, callback);
};

export const offBlockSettingsUpdated = (callback: BlockSettingsUpdateCallback) => {
    window.emitter.off(APP_BRIDGE_BLOCK_SETTINGS_UPDATED_EVENT, callback);
};

export const notifyBlockSettingsUpdated = (blockSettings: {
    blockId: number;
    blockSettings: Record<string, unknown>;
}) => {
    window.emitter.emit(APP_BRIDGE_BLOCK_SETTINGS_UPDATED_EVENT, blockSettings);
};
