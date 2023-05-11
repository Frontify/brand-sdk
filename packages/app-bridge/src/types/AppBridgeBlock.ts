/* (c) Copyright Frontify Ltd., all rights reserved. */

import { BlockSettingsUpdateEvent } from '../react';
import { Asset } from './Asset';
import { AssetChooserOptions } from './Terrific';

export type DispatchActions =
    | 'openAssetChooser'
    | 'closeAssetChooser'
    | 'getBlockAssets'
    | 'AppBridge:OnBlockSettingsUpdated'
    | 'AppBridge:OffBlockSettingsUpdated'
    | 'AppBridge:BlockSettingsUpdated';

export type OpenAssetChooserPayload = {
    callback: (selectedAssets: Asset[]) => void;
    options?: AssetChooserOptions;
};

export type UpdateBlockSettingsFromEventCallback = (event: BlockSettingsUpdateEvent) => void;

export type BlockSettingsUpdatedEventPayload = {
    blockId: number;
    blockSettings: Record<string, unknown>;
};

export type BlockAssets = Record<string, Asset[]>;

export type DispatchPayload =
    | OpenAssetChooserPayload
    | UpdateBlockSettingsFromEventCallback
    | BlockSettingsUpdatedEventPayload;

export type EventResponse = Promise<BlockAssets> | BlockSettingsUpdateEvent | void;
