/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { AssetChooserOptions, DispatchHandler } from '../types';

export const openAssetChooser = (options?: AssetChooserOptions): DispatchHandler<'openAssetChooser'> => ({
    commandName: 'openAssetChooser',
    options,
});

export const closeAssetChooser = (): DispatchHandler<'closeAssetChooser'> => ({
    commandName: 'closeAssetChooser',
});
