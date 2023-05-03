/* (c) Copyright Frontify Ltd., all rights reserved. */

export type BlockSettingsUpdateEvent<T = Record<string, unknown>> = {
    blockId: number;
    blockSettings: T;
};

export type BlockSettingsUpdateCallback<T = Record<string, unknown>> = (event: BlockSettingsUpdateEvent<T>) => void;

export enum BlockSettingsEvents {
    BlockSettingsUpdated = 'AppBridge:BlockSettingsUpdated',
}
